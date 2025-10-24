import type { Message, ToolUseBlock, ResultMessage, SystemMessage, ModelUsageInfo } from './types.js';
import type { Logger } from './logger.js';

/**
 * Response parser for extracting and transforming Claude messages
 * Provides convenient methods for common parsing patterns
 * 
 * @example
 * ```typescript
 * const result = await claude()
 *   .query('Create a hello.txt file')
 *   .asText(); // Returns just the text content
 * 
 * const files = await claude()
 *   .query('Read all config files')
 *   .findToolResults('Read'); // Returns all Read tool results
 * ```
 */
export class ResponseParser {
  private messages: Message[] = [];
  private consumed = false;

  constructor(
    private generator: AsyncGenerator<Message>,
    private handlers: Array<(message: Message) => void> = [],
    private logger?: Logger
  ) {}

  /**
   * Get all messages as an array (consumes the generator)
   */
  async asArray(): Promise<Message[]> {
    await this.consume();
    return this.messages;
  }

  /**
   * Get only the text content from assistant messages
   */
  async asText(): Promise<string> {
    await this.consume();
    
    const texts: string[] = [];
    for (const msg of this.messages) {
      if (msg.type === 'assistant') {
        for (const block of msg.content) {
          if (block.type === 'text') {
            texts.push(block.text);
          }
        }
      }
    }
    
    return texts.join('\n');
  }

  /**
   * Get the final result message content
   */
  async asResult(): Promise<string | null> {
    await this.consume();
    
    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    return resultMsg?.content ?? null;
  }

  /**
   * Get all tool uses with their results
   */
  async asToolExecutions(): Promise<ToolExecution[]> {
    await this.consume();
    
    const executions: ToolExecution[] = [];
    const toolUses = new Map<string, ToolUseBlock>();
    
    for (const msg of this.messages) {
      if (msg.type === 'assistant') {
        for (const block of msg.content) {
          if (block.type === 'tool_use') {
            toolUses.set(block.id, block);
          } else if (block.type === 'tool_result') {
            const toolUse = toolUses.get(block.tool_use_id);
            if (toolUse) {
              executions.push({
                tool: toolUse.name,
                input: toolUse.input,
                result: block.content,
                isError: block.is_error ?? false
              });
            }
          }
        }
      }
    }
    
    return executions;
  }

  /**
   * Find all tool results for a specific tool
   */
  async findToolResults(toolName: string): Promise<unknown[]> {
    const executions = await this.asToolExecutions();
    return executions
      .filter(exec => exec.tool === toolName && !exec.isError)
      .map(exec => exec.result);
  }

  /**
   * Get first tool result for a specific tool
   */
  async findToolResult(toolName: string): Promise<unknown | null> {
    const results = await this.findToolResults(toolName);
    return results[0] ?? null;
  }

  /**
   * Extract structured data from the response
   */
  async asJSON<T = unknown>(): Promise<T | null> {
    const text = await this.asText();
    
    // Try to find JSON in code blocks first
    const codeBlockMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1] ?? '');
      } catch (e) {
        this.logger?.warn('Failed to parse JSON from code block', { error: e });
      }
    }
    
    // Try to parse the entire text as JSON
    try {
      return JSON.parse(text);
    } catch {
      // Try to find JSON-like content
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          this.logger?.warn('Failed to parse JSON from text', { error: e });
        }
      }
    }
    
    return null;
  }

  /**
   * Get usage statistics
   */
  async getUsage(): Promise<UsageStats | null> {
    await this.consume();
    
    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    if (!resultMsg?.usage) return null;
    
    return {
      inputTokens: resultMsg.usage.input_tokens ?? 0,
      outputTokens: resultMsg.usage.output_tokens ?? 0,
      cacheCreationTokens: resultMsg.usage.cache_creation_input_tokens ?? 0,
      cacheReadTokens: resultMsg.usage.cache_read_input_tokens ?? 0,
      totalTokens: (resultMsg.usage.input_tokens ?? 0) + (resultMsg.usage.output_tokens ?? 0),
      totalCost: resultMsg.cost?.total_cost ?? 0
    };
  }

  /**
   * Get the session ID if available
   */
  async getSessionId(): Promise<string | null> {
    await this.consume();

    // Look for session_id on any message (CLI sets this on all messages)
    for (const msg of this.messages) {
      if ('session_id' in msg && msg.session_id) {
        return msg.session_id;
      }

      // Also check system messages with session data
      if (msg.type === 'system' && msg.data && typeof msg.data === 'object' && 'session_id' in msg.data) {
        return String(msg.data.session_id);
      }
    }

    return null;
  }

  /**
   * Get performance metrics (duration, turns, etc)
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics | null> {
    await this.consume();

    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    if (!resultMsg) return null;

    return {
      durationMs: resultMsg.duration_ms,
      durationApiMs: resultMsg.duration_api_ms,
      numTurns: resultMsg.num_turns
    };
  }

  /**
   * Get permission denials if any
   */
  async getPermissionDenials(): Promise<string[]> {
    await this.consume();

    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    return resultMsg?.permission_denials ?? [];
  }

  /**
   * Get system capabilities and metadata
   */
  async getSystemCapabilities(): Promise<SystemCapabilities | null> {
    await this.consume();

    const systemMsg = this.messages.find((msg): msg is SystemMessage => msg.type === 'system');
    if (!systemMsg) return null;

    return {
      model: systemMsg.model,
      claudeCodeVersion: systemMsg.claude_code_version,
      permissionMode: systemMsg.permissionMode,
      apiKeySource: systemMsg.apiKeySource,
      outputStyle: systemMsg.output_style,
      cwd: systemMsg.cwd,
      uuid: systemMsg.uuid,
      tools: systemMsg.tools ?? [],
      mcpServers: systemMsg.mcp_servers ?? [],
      slashCommands: systemMsg.slash_commands ?? [],
      agents: systemMsg.agents ?? [],
      skills: systemMsg.skills ?? []
    };
  }

  /**
   * Get per-model usage breakdown
   */
  async getModelUsageBreakdown(): Promise<Record<string, ModelUsageInfo> | null> {
    await this.consume();

    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    return resultMsg?.modelUsage ?? null;
  }

  /**
   * Get request UUID for tracking
   */
  async getRequestUUID(): Promise<string | null> {
    await this.consume();

    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    if (resultMsg?.uuid) return resultMsg.uuid;

    // Fallback to system message UUID
    const systemMsg = this.messages.find((msg): msg is SystemMessage => msg.type === 'system');
    return systemMsg?.uuid ?? null;
  }

  /**
   * Get web search usage statistics
   */
  async getWebSearchUsage(): Promise<WebSearchUsage | null> {
    await this.consume();

    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    if (!resultMsg) return null;

    const totalSearches = resultMsg.usage?.server_tool_use?.web_search_requests ?? 0;
    const byModel: Record<string, number> = {};

    if (resultMsg.modelUsage) {
      for (const [model, stats] of Object.entries(resultMsg.modelUsage)) {
        if (stats.webSearchRequests) {
          byModel[model] = stats.webSearchRequests;
        }
      }
    }

    return {
      total: totalSearches,
      byModel
    };
  }

  /**
   * Get cache tier breakdown (ephemeral 5m vs 1h)
   */
  async getCacheBreakdown(): Promise<CacheBreakdown | null> {
    await this.consume();

    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    if (!resultMsg?.usage?.cache_creation) return null;

    return {
      ephemeral5m: resultMsg.usage.cache_creation.ephemeral_5m_input_tokens ?? 0,
      ephemeral1h: resultMsg.usage.cache_creation.ephemeral_1h_input_tokens ?? 0
    };
  }

  /**
   * Stream messages with a callback (doesn't consume for other methods)
   */
  async stream(callback: (message: Message) => void | Promise<void>): Promise<void> {
    for await (const message of this.generator) {
      // Run handlers
      for (const handler of this.handlers) {
        try {
          handler(message);
        } catch (error) {
          this.logger?.error('Message handler error', { error });
        }
      }
      
      // Store message
      this.messages.push(message);
      
      // Run callback
      await callback(message);
    }
    
    this.consumed = true;
  }

  /**
   * Wait for completion and return success status
   */
  async succeeded(): Promise<boolean> {
    await this.consume();
    
    const resultMsg = this.messages.findLast((msg): msg is ResultMessage => msg.type === 'result');
    if (!resultMsg) return false;
    
    // Check if any tool execution failed
    const executions = await this.asToolExecutions();
    const hasErrors = executions.some(exec => exec.isError);
    
    return !hasErrors;
  }

  /**
   * Get all error messages
   */
  async getErrors(): Promise<string[]> {
    await this.consume();
    
    const errors: string[] = [];
    
    // Check system messages for errors
    for (const msg of this.messages) {
      if (msg.type === 'system' && msg.subtype === 'error') {
        const errorMessage = msg.data && typeof msg.data === 'object' && 'message' in msg.data
          ? String(msg.data.message)
          : 'Unknown error';
        errors.push(errorMessage);
      }
    }
    
    // Check tool results for errors
    const executions = await this.asToolExecutions();
    for (const exec of executions) {
      if (exec.isError) {
        errors.push(`Tool ${exec.tool} failed: ${exec.result}`);
      }
    }
    
    return errors;
  }

  /**
   * Transform messages using a custom transformer
   */
  async transform<T>(transformer: (messages: Message[]) => T): Promise<T> {
    await this.consume();
    return transformer(this.messages);
  }

  /**
   * Consume the generator if not already consumed
   */
  private async consume(): Promise<void> {
    if (this.consumed) return;
    
    this.logger?.debug('Consuming message generator');
    
    for await (const message of this.generator) {
      this.logger?.debug('Received message', { type: message.type });
      
      // Run handlers
      for (const handler of this.handlers) {
        try {
          handler(message);
        } catch (error) {
          this.logger?.error('Message handler error', { error });
        }
      }
      
      this.messages.push(message);
    }
    
    this.consumed = true;
    this.logger?.debug('Message generator consumed', { messageCount: this.messages.length });
  }
}

/**
 * Represents a tool execution with its input and result
 */
export interface ToolExecution {
  tool: string;
  input: Record<string, unknown>;
  result: unknown;
  isError: boolean;
}

/**
 * Usage statistics for a query
 */
export interface UsageStats {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  totalCost: number;
}

/**
 * Performance metrics for a query
 */
export interface PerformanceMetrics {
  durationMs?: number;
  durationApiMs?: number;
  numTurns?: number;
}

/**
 * System capabilities and metadata
 */
export interface SystemCapabilities {
  model?: string;
  claudeCodeVersion?: string;
  permissionMode?: string;
  apiKeySource?: string;
  outputStyle?: string;
  cwd?: string;
  uuid?: string;
  tools: string[];
  mcpServers: Array<{ name: string; status: string }>;
  slashCommands: string[];
  agents: string[];
  skills: string[];
}

/**
 * Web search usage statistics
 */
export interface WebSearchUsage {
  total: number;
  byModel: Record<string, number>;
}

/**
 * Cache tier breakdown (ephemeral 5m vs 1h)
 */
export interface CacheBreakdown {
  ephemeral5m: number;
  ephemeral1h: number;
}