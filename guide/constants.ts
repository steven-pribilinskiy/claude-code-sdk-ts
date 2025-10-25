import type { PermissionMode, ToolName } from '../dist/index.js';
import { ALL_TOOLS } from '../dist/index.js';

export const PERMISSION_MODES: PermissionMode[] = [
  'default',
  'acceptEdits',
  'bypassPermissions'
];

export const TOOL_DESCRIPTIONS: Record<ToolName, string> = {
  Read: 'Read file contents',
  Write: 'Create and write to files',
  Edit: 'Edit existing files',
  MultiEdit: 'Edit multiple files simultaneously',
  Bash: 'Execute shell commands',
  Grep: 'Search for patterns in files',
  Glob: 'File globbing and pattern matching',
  LS: 'List directory contents',
  MCPTool: 'Model Context Protocol tools',
  NotebookRead: 'Read Jupyter notebooks',
  NotebookEdit: 'Edit Jupyter notebooks',
  SlashCommand: 'Run custom slash commands',
  Task: 'Execute complex tasks',
  TodoRead: 'Read todo items',
  TodoWrite: 'Create/update todo items',
  WebFetch: 'Make HTTP requests',
  WebSearch: 'Search the web'
};

export const TOOL_CATEGORIES = {
  'File Operations': ['Read', 'Write', 'Edit', 'MultiEdit', 'LS', 'Grep', 'Glob'],
  'Notebook Operations': ['NotebookRead', 'NotebookEdit'],
  'Web & External': ['WebFetch', 'WebSearch', 'Bash'],
  'Task Management': ['TodoRead', 'TodoWrite', 'Task'],
  'Extensions': ['MCPTool', 'SlashCommand']
} as const;

export const TOOLS_COUNT = ALL_TOOLS.length;

