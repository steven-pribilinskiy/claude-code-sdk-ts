import type { ClaudeCodeOptions, Message, CLIOutput } from '../types.js';
import { PersistentCLITransport, type ProcessState, type PersistentTransportEvent } from './persistent-cli-transport.js';
import { createMessageGenerator, type MessageGenerator } from './message-generator.js';

/**
 * State of a persistent Claude session
 */
export interface PersistentSessionState {
  sessionId?: string;
  processState: ProcessState;
  isAlive: boolean;
  messageCount: number;
}

/**
 * Result of querying a persistent session
 */
export interface PersistentQueryResult {
  messages: Message[];
  sessionState: PersistentSessionState;
}

/**
 * A persistent Claude Code client that keeps a single CLI process alive
 * across multiple queries, enabling the 5-minute ephemeral cache to work.
 * 
 * This implementation follows the claude-code-viewer pattern:
 * https://github.com/d-kimuson/claude-code-viewer
 * 
 * @example
 * ```typescript
 * const client = new PersistentClient({ cwd: '/path/to/project' });
 * 
 * // Start the persistent process
 * await client.start();
 * 
 * // Send first query (cache miss)
 * const result1 = await client.query("List files in this directory");
 * console.log(result1.messages);
 * 
 * // Send second query to SAME process (cache hit!)
 * const result2 = await client.query("What's in package.json?");
 * console.log(result2.messages);
 * 
 * // Clean up
 * await client.stop();
 * ```
 */
export class PersistentClient {
  private options: ClaudeCodeOptions;
  private transport?: PersistentCLITransport;
  private messageGenerator?: MessageGenerator;
  private messageCount: number = 0;
  private pendingMessages: Message[] = [];
  private waitingForResult: (() => void)[] = [];

  constructor(options: ClaudeCodeOptions = {}) {
    this.options = options;
  }

  /**
   * Start the persistent Claude CLI process
   * 
   * @param initialPrompt - Optional initial prompt to send immediately.
   *                       If not provided, the process will wait for the first query().
   */
  async start(initialPrompt?: string): Promise<void> {
    if (this.transport) {
      throw new Error('Client already started');
    }

    // Create the message generator
    this.messageGenerator = createMessageGenerator();

    // Create the transport
    this.transport = new PersistentCLITransport(this.options);

    // Subscribe to transport events
    this.transport.on(this.handleTransportEvent.bind(this));

    // Start the transport with the generator
    await this.transport.start(this.messageGenerator.generateMessages());

    // If an initial prompt is provided, send it immediately
    // This is needed because Claude CLI with --print expects input to start
    if (initialPrompt) {
      this.messageGenerator.setNextMessage(initialPrompt);
    }

    // Wait for session to initialize
    await this.waitForSessionInit();
  }

  /**
   * Check if the process is running
   */
  isAlive(): boolean {
    return this.transport?.isAlive() ?? false;
  }

  /**
   * Get the current session state
   */
  getState(): PersistentSessionState {
    return {
      sessionId: this.transport?.getSessionId(),
      processState: this.transport?.getState() ?? 'not_started',
      isAlive: this.isAlive(),
      messageCount: this.messageCount,
    };
  }

  /**
   * Send a query to the persistent Claude process
   */
  async query(prompt: string): Promise<PersistentQueryResult> {
    if (!this.transport || !this.messageGenerator) {
      throw new Error('Client not started. Call start() first.');
    }

    if (!this.isAlive()) {
      throw new Error('Process is not alive');
    }

    console.log('[PersistentClient] Sending query:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));

    // Reset pending messages for this query
    this.pendingMessages = [];

    // Send the message via the generator
    this.messageGenerator.setNextMessage(prompt);
    this.messageCount++;

    // Wait for the result
    await this.waitForResult();

    console.log('[PersistentClient] Query completed, collected', this.pendingMessages.length, 'messages');

    return {
      messages: [...this.pendingMessages],
      sessionState: this.getState(),
    };
  }

  /**
   * Stop the persistent process
   */
  async stop(): Promise<void> {
    if (this.messageGenerator) {
      this.messageGenerator.terminate();
      this.messageGenerator = undefined;
    }

    if (this.transport) {
      await this.transport.terminate();
      this.transport = undefined;
    }

    this.messageCount = 0;
    this.pendingMessages = [];
  }

  /**
   * Handle events from the transport
   */
  private handleTransportEvent(event: PersistentTransportEvent): void {
    switch (event.type) {
      case 'message':
        if (event.message) {
          this.handleMessage(event.message);
        }
        break;

      case 'state_change':
        console.log('[PersistentClient] State changed to:', event.state);
        if (event.state === 'paused') {
          // Task completed, resolve any waiting promises
          this.resolveWaitingForResult();
        }
        break;

      case 'error':
        console.error('[PersistentClient] Transport error:', event.error);
        break;

      case 'session_initialized':
        console.log('[PersistentClient] Session initialized:', event.sessionId);
        break;
    }
  }

  /**
   * Handle a message from Claude
   */
  private handleMessage(cliOutput: CLIOutput): void {
    // Convert CLIOutput to Message format
    const message: Message = {
      type: cliOutput.type,
      ...(cliOutput as any), // Include all properties
    };

    this.pendingMessages.push(message);

    // If it's a result message, we're done with this query
    if (cliOutput.type === 'result') {
      this.resolveWaitingForResult();
    }
  }

  /**
   * Wait for session initialization
   */
  private async waitForSessionInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Session initialization timeout'));
      }, 30000); // 30 second timeout

      const checkInit = () => {
        const state = this.transport?.getState();
        const sessionId = this.transport?.getSessionId();
        
        if (sessionId) {
          clearTimeout(timeout);
          resolve();
        } else if (state === 'error' || state === 'terminated') {
          clearTimeout(timeout);
          reject(new Error('Process failed to initialize'));
        } else {
          setTimeout(checkInit, 100);
        }
      };

      checkInit();
    });
  }

  /**
   * Wait for the current query to complete
   */
  private async waitForResult(): Promise<void> {
    return new Promise((resolve) => {
      this.waitingForResult.push(resolve);
    });
  }

  /**
   * Resolve all promises waiting for result
   */
  private resolveWaitingForResult(): void {
    const callbacks = [...this.waitingForResult];
    this.waitingForResult = [];
    
    for (const callback of callbacks) {
      callback();
    }
  }
}

