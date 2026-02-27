import { execa } from 'execa';
import which from 'which';
import { createInterface } from 'node:readline';
import { platform } from 'node:os';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { access, constants } from 'node:fs/promises';
import { CLIConnectionError, CLINotFoundError, ProcessError, AbortError } from '../errors.js';
import type { ClaudeCodeOptions, CLIOutput, UserMessage } from '../types.js';
import { SubprocessAbortHandler } from '../_internal/transport/subprocess-abort-handler.js';

/**
 * Process state for managing the lifecycle of a persistent Claude CLI process
 */
export type ProcessState = 
  | 'not_started'      // Process hasn't been spawned yet
  | 'initializing'     // Process is spawning
  | 'ready'            // Process is ready to receive messages
  | 'processing'       // Process is handling a message
  | 'paused'           // Process finished a message, waiting for next
  | 'terminating'      // Process is being shut down
  | 'terminated'       // Process has exited
  | 'error';           // Process encountered an error

/**
 * Event emitted by the persistent transport
 */
export interface PersistentTransportEvent {
  type: 'state_change' | 'message' | 'error' | 'session_initialized';
  state?: ProcessState;
  message?: CLIOutput;
  error?: Error;
  sessionId?: string;
}

/**
 * Persistent CLI transport that keeps a Claude CLI process alive
 * and can feed it multiple messages over time.
 * 
 * This implementation is inspired by claude-code-viewer's approach:
 * https://github.com/d-kimuson/claude-code-viewer
 */
export class PersistentCLITransport {
  private process?: ReturnType<typeof execa>;
  private options: ClaudeCodeOptions;
  private state: ProcessState = 'not_started';
  private sessionId?: string;
  private abortHandler?: SubprocessAbortHandler;
  private cleanupAbort?: () => void;
  private eventHandlers: ((event: PersistentTransportEvent) => void)[] = [];

  constructor(options: ClaudeCodeOptions = {}) {
    this.options = options;
  }

  /**
   * Get the current process state
   */
  getState(): ProcessState {
    return this.state;
  }

  /**
   * Get the session ID (available after initialization)
   */
  getSessionId(): string | undefined {
    return this.sessionId;
  }

  /**
   * Check if the process is alive and ready
   */
  isAlive(): boolean {
    return this.state !== 'not_started' && 
           this.state !== 'terminated' && 
           this.state !== 'error' &&
           this.process !== undefined &&
           !this.process.killed;
  }

  /**
   * Subscribe to transport events
   */
  on(handler: (event: PersistentTransportEvent) => void): () => void {
    this.eventHandlers.push(handler);
    return () => {
      const index = this.eventHandlers.indexOf(handler);
      if (index > -1) {
        this.eventHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(event: PersistentTransportEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('[PersistentCLITransport] Error in event handler:', error);
      }
    }
  }

  /**
   * Update the process state and emit event
   */
  private setState(newState: ProcessState): void {
    if (this.state !== newState) {
      console.log(`[PersistentCLITransport] State: ${this.state} -> ${newState}`);
      this.state = newState;
      this.emit({ type: 'state_change', state: newState });
    }
  }

  /**
   * Find the Claude CLI executable
   */
  private async findCLI(): Promise<string> {
    // First check for local Claude installation
    const localPaths = [
      join(homedir(), '.claude', 'local', 'claude'),
      join(homedir(), '.claude', 'bin', 'claude')
    ];
    
    for (const path of localPaths) {
      try {
        await access(path, constants.X_OK);
        return path;
      } catch {
        // Continue checking
      }
    }
    
    // Then try to find in PATH
    try {
      return await which('claude');
    } catch {
      try {
        return await which('claude-code');
      } catch {
        // Not found
      }
    }
    
    // Check platform-specific locations
    if (platform() === 'darwin') {
      const macPaths = [
        '/Applications/Claude.app/Contents/Resources/claude-cli/claude',
        '/usr/local/bin/claude'
      ];
      
      for (const path of macPaths) {
        try {
          await access(path, constants.X_OK);
          return path;
        } catch {
          // Continue checking
        }
      }
    }
    
    throw new CLINotFoundError(
      'Claude CLI not found. Please install it first.\n' +
      'Visit: https://github.com/anthropics/anthropic-sdk-typescript/tree/main/packages/claude-code'
    );
  }

  /**
   * Build command arguments for the CLI
   */
  private buildCommand(isResume: boolean = false): string[] {
    const args: string[] = ['--output-format', 'stream-json', '--verbose'];
    
    if (isResume && this.sessionId) {
      args.push('--resume', this.sessionId);
    }
    
    if (this.options.cwd) {
      args.push('--add-dir', this.options.cwd);
    }
    
    if (this.options.allowedTools && this.options.allowedTools.length > 0) {
      args.push('--allowedTools', this.options.allowedTools.join(','));
    }
    
    if (this.options.deniedTools && this.options.deniedTools.length > 0) {
      args.push('--disallowedTools', this.options.deniedTools.join(','));
    }
    
    // Handle permission mode - map to CLI's actual flag
    if (this.options.permissionMode === 'bypassPermissions') {
      args.push('--dangerously-skip-permissions');
    }
    
    // Handle MCP config
    if (this.options.mcpServers && this.options.mcpServers.length > 0) {
      const mcpConfig = {
        mcpServers: this.options.mcpServers
      };
      args.push('--mcp-config', JSON.stringify(mcpConfig));
    }
    
    // Handle MCP server permissions
    if (this.options.mcpServerPermissions && Object.keys(this.options.mcpServerPermissions).length > 0) {
      args.push('--mcp-server-permissions', JSON.stringify(this.options.mcpServerPermissions));
    }
    
    // Handle configuration file
    if (this.options.configFile) {
      args.push('--config-file', this.options.configFile);
    }
    
    // Handle role
    if (this.options.role) {
      args.push('--role', this.options.role);
    }
    
    if (this.options.systemPrompt) {
      args.push('--system-prompt', this.options.systemPrompt);
    }
    
    if (this.options.permissionMode) {
      args.push('--permission-mode', this.options.permissionMode);
    }
    
    if (this.options.model) {
      args.push('--model', this.options.model);
    }
    
    // Use --print flag to enable stdin input
    args.push('--print');
    
    return args;
  }

  /**
   * Start the persistent Claude CLI process with a message generator
   */
  async start(messageGenerator: AsyncGenerator<UserMessage, void, unknown>): Promise<void> {
    if (this.state !== 'not_started') {
      throw new ProcessError('Process already started');
    }

    this.setState('initializing');

    try {
      const cliPath = await this.findCLI();
      const args = this.buildCommand(false);
      
      console.log('[PersistentCLITransport] Starting Claude CLI:', cliPath, args.join(' '));
      
      // Spawn the process
      this.process = execa(cliPath, args, {
        cwd: this.options.cwd || process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        reject: false,
        buffer: false,
        env: {
          ...process.env,
          FORCE_COLOR: '0',
          NO_COLOR: '1',
        },
      });

      // Set up abort handling
      if (this.options.signal) {
        this.abortHandler = new SubprocessAbortHandler(
          this.process as any, // Type assertion for execa return type compatibility
          this.options.signal
        );
        this.cleanupAbort = this.abortHandler.setup();
      }

      if (!this.process.stdin || !this.process.stdout) {
        throw new CLIConnectionError('Failed to get process stdin/stdout');
      }

      // Important: Don't close stdin! Keep it open for feeding messages
      console.log('[PersistentCLITransport] Process stdin is OPEN and will stay open');

      // Handle stderr for debugging
      if (this.process.stderr) {
        this.process.stderr.on('data', (data: Buffer) => {
          console.error('[PersistentCLITransport] stderr:', data.toString());
        });
      }

      // Start processing the message generator
      this.processMessageGenerator(messageGenerator);

      // Start reading output
      this.processOutput();

      this.setState('ready');

    } catch (error) {
      this.setState('error');
      this.emit({ type: 'error', error: error as Error });
      throw error;
    }
  }

  /**
   * Process messages from the generator and write to stdin
   */
  private async processMessageGenerator(
    messageGenerator: AsyncGenerator<UserMessage, void, unknown>
  ): Promise<void> {
    try {
      for await (const message of messageGenerator) {
        if (!this.isAlive() || !this.process?.stdin) {
          console.log('[PersistentCLITransport] Process not alive, stopping message generator');
          break;
        }

        this.setState('processing');
        
        const messageText = typeof message.content === 'string' 
          ? message.content 
          : JSON.stringify(message.content);
        
        console.log('[PersistentCLITransport] Writing message to stdin:', 
          messageText.substring(0, 100) + (messageText.length > 100 ? '...' : ''));
        
        // Write the message to stdin
        this.process.stdin.write(messageText + '\n');
        
        // Wait for Claude to finish processing (state will change to 'paused')
        await this.waitForPause();
      }
      
      console.log('[PersistentCLITransport] Message generator completed');
    } catch (error) {
      if (this.options.signal?.aborted) {
        throw new AbortError('Process aborted');
      }
      console.error('[PersistentCLITransport] Error in message generator:', error);
      this.setState('error');
      this.emit({ type: 'error', error: error as Error });
    }
  }

  /**
   * Wait for the process to finish processing and enter paused state
   */
  private async waitForPause(): Promise<void> {
    return new Promise((resolve) => {
      const checkState = () => {
        if (this.state === 'paused' || this.state === 'ready') {
          resolve();
        } else {
          setTimeout(checkState, 100);
        }
      };
      checkState();
    });
  }

  /**
   * Process output from the Claude CLI
   */
  private async processOutput(): Promise<void> {
    if (!this.process?.stdout) {
      throw new CLIConnectionError('No stdout available');
    }

    const rl = createInterface({
      input: this.process.stdout,
      crlfDelay: Infinity,
    });

    try {
      for await (const line of rl) {
        if (this.options.signal?.aborted) {
          throw new AbortError('Process aborted');
        }

        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        console.log('[PersistentCLITransport] Received line:', trimmedLine.substring(0, 200));

        try {
          const parsed = JSON.parse(trimmedLine) as CLIOutput;
          
          // Capture session ID
          if (parsed.type === 'system' && parsed.subtype === 'init' && parsed.session_id) {
            this.sessionId = parsed.session_id;
            console.log('[PersistentCLITransport] Session initialized:', this.sessionId);
            this.emit({ type: 'session_initialized', sessionId: this.sessionId });
          }

          // Check for result message (indicates task completion)
          if (parsed.type === 'result') {
            console.log('[PersistentCLITransport] Task completed, entering paused state');
            this.setState('paused');
          }

          // Emit the message
          this.emit({ type: 'message', message: parsed });

        } catch (parseError) {
          console.warn('[PersistentCLITransport] Failed to parse line:', trimmedLine);
        }
      }
    } catch (error) {
      if (this.options.signal?.aborted) {
        throw new AbortError('Process aborted');
      }
      console.error('[PersistentCLITransport] Error reading output:', error);
      this.setState('error');
      this.emit({ type: 'error', error: error as Error });
    }
  }

  /**
   * Terminate the process
   */
  async terminate(): Promise<void> {
    if (this.state === 'terminated' || this.state === 'not_started') {
      return;
    }

    this.setState('terminating');

    try {
      // Close stdin to signal end of input
      if (this.process?.stdin) {
        this.process.stdin.end();
      }

      // Kill the process
      if (this.process && !this.process.killed) {
        this.process.kill();
      }

      // Wait for process to exit
      if (this.process) {
        await this.process.catch(() => {
          // Ignore exit errors
        });
      }

      this.setState('terminated');
    } finally {
      if (this.cleanupAbort) {
        this.cleanupAbort();
        this.cleanupAbort = undefined;
      }
      this.process = undefined;
    }
  }
}

