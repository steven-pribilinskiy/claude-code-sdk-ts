import { SubprocessCLITransport } from './transport/subprocess-cli.js';
import type { ClaudeCodeOptions, Message, CLIOutput, AssistantMessage, CLIAssistantOutput, CLIErrorOutput, CLISystemOutput, CLIResultOutput, SystemMessage, ResultMessage } from '../types.js';
import { detectErrorType, createTypedError } from '../errors.js';
import { loadSafeEnvironmentOptions } from '../environment.js';
import { applyEnvironmentOptions } from './options-merger.js';

export class InternalClient {
  private options: ClaudeCodeOptions;
  private prompt: string;

  constructor(prompt: string, options: ClaudeCodeOptions = {}) {
    this.prompt = prompt;
    
    // Load safe environment variables and merge with user options
    const envOptions = loadSafeEnvironmentOptions();
    this.options = applyEnvironmentOptions(options, envOptions);
  }

  async *processQuery(): AsyncGenerator<Message> {
    const transport = new SubprocessCLITransport(this.prompt, this.options);

    try {
      await transport.connect();

      for await (const output of transport.receiveMessages()) {
        const message = this.parseMessage(output);
        if (message) {
          yield message;
        }
      }
    } finally {
      await transport.disconnect();
    }
  }

  private parseMessage(output: CLIOutput): Message | null {
    // Handle CLIOutput types based on actual CLI output
    switch (output.type) {
      case 'assistant': {
        // Extract the actual assistant message from the wrapper
        const assistantMsg = output as CLIAssistantOutput;
        if (assistantMsg.message) {
          // Return a simplified assistant message with just the content
          return {
            type: 'assistant',
            content: assistantMsg.message.content,
            session_id: assistantMsg.session_id
          } as AssistantMessage;
        }
        return {
          type: 'assistant',
          content: [],
          session_id: assistantMsg.session_id
        } as AssistantMessage;
      }

      case 'system': {
        // System init messages - now expose full capabilities data
        const systemMsg = output as CLISystemOutput;
        return {
          type: 'system',
          subtype: systemMsg.subtype,
          session_id: systemMsg.session_id,
          model: systemMsg.model,
          claude_code_version: systemMsg.claude_code_version,
          permissionMode: systemMsg.permissionMode,
          apiKeySource: systemMsg.apiKeySource,
          output_style: systemMsg.output_style,
          cwd: systemMsg.cwd,
          uuid: systemMsg.uuid,
          tools: systemMsg.tools,
          mcp_servers: systemMsg.mcp_servers,
          slash_commands: systemMsg.slash_commands,
          agents: systemMsg.agents,
          skills: systemMsg.skills
        } as SystemMessage;
      }

      case 'result': {
        // Result message with full metadata - return all fields
        const resultMsg = output as CLIResultOutput;
        return {
          type: 'result',
          subtype: resultMsg.subtype,
          content: resultMsg.content || '',
          session_id: resultMsg.session_id,
          duration_ms: resultMsg.duration_ms,
          duration_api_ms: resultMsg.duration_api_ms,
          num_turns: resultMsg.num_turns,
          usage: resultMsg.usage,
          cost: resultMsg.cost ? {
            total_cost: resultMsg.cost.total_cost_usd
          } : undefined,
          modelUsage: resultMsg.modelUsage,
          permission_denials: resultMsg.permission_denials,
          uuid: resultMsg.uuid,
          total_cost_usd: resultMsg.total_cost_usd
        } as ResultMessage;
      }

      case 'error': {
        const errorOutput = output as CLIErrorOutput;
        const errorMessage = errorOutput.error?.message || 'Unknown error';
        const errorType = detectErrorType(errorMessage);
        throw createTypedError(errorType, errorMessage, errorOutput.error);
      }

      default:
        // Skip unknown message types
        return null;
    }
  }
}