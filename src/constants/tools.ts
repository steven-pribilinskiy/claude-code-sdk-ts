import type { ToolName } from '../types.js';

/**
 * Complete list of all tools available to Claude Code.
 * 
 * These tools enable Claude to understand and modify codebases, execute
 * commands, search files, fetch web content, and more.
 * 
 * Tools are categorized by permission requirements:
 * - Permission required: Bash, Edit, MultiEdit, NotebookEdit, SlashCommand,
 *   WebFetch, WebSearch, Write
 * - No permission required: Glob, Grep, NotebookRead, Read, Task, TodoWrite
 * 
 * Note: MCPTool provides access to Model Context Protocol integrations.
 * 
 * @see {@link https://docs.claude.com/en/docs/claude-code/settings#tools-available-to-claude}
 * 
 * @example
 * ```typescript
 * import { ALL_TOOLS } from '@instantlyeasy/claude-code-sdk-ts';
 * 
 * // Allow all tools
 * await claude()
 *   .allowTools(...ALL_TOOLS)
 *   .query('Analyze this project')
 *   .asText();
 * ```
 */
export const ALL_TOOLS: ToolName[] = [
  'Read',
  'Write',
  'Edit',
  'MultiEdit',
  'Bash',
  'Grep',
  'Glob',
  'LS',
  'MCPTool',
  'NotebookRead',
  'NotebookEdit',
  'SlashCommand',
  'Task',
  'TodoRead',
  'TodoWrite',
  'WebFetch',
  'WebSearch',
];
