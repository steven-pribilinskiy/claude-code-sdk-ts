// Permission modes for Claude Code operations
export type PermissionMode = 'default' | 'acceptEdits' | 'bypassPermissions';

// Tool names that can be allowed or denied
export type ToolName = 
  | 'Read'
  | 'Write'
  | 'Edit'
  | 'Bash'
  | 'Grep'
  | 'Glob'
  | 'LS'
  | 'MultiEdit'
  | 'NotebookRead'
  | 'NotebookEdit'
  | 'WebFetch'
  | 'TodoRead'
  | 'TodoWrite'
  | 'WebSearch'
  | 'Task'
  | 'MCPTool';

// Content block types
export interface TextBlock {
  type: 'text';
  text: string;
}

export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | Array<TextBlock | unknown>;
  is_error?: boolean;
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

// Model usage breakdown information
export interface ModelUsageInfo {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests?: number;
  costUSD: number;
  contextWindow?: number;
}

// Message types
export interface UserMessage {
  type: 'user';
  content: string;
  session_id?: string;
}

export interface AssistantMessage {
  type: 'assistant';
  content: ContentBlock[];
  session_id?: string;
}

export interface SystemMessage {
  type: 'system';
  subtype?: string;
  data?: unknown;
  session_id?: string;
  // Full system init data
  model?: string;
  claude_code_version?: string;
  permissionMode?: string;
  apiKeySource?: string;
  output_style?: string;
  cwd?: string;
  uuid?: string;
  tools?: string[];
  mcp_servers?: Array<{ name: string; status: string }>;
  slash_commands?: string[];
  agents?: string[];
  skills?: string[];
}

export interface ResultMessage {
  type: 'result';
  subtype?: string;
  content: string;
  session_id?: string;
  // Performance metrics
  duration_ms?: number;
  duration_api_ms?: number;
  num_turns?: number;
  // Error status
  is_error?: boolean;
  // Result text (alternative simplified access to content)
  result?: string;
  // Token and cost usage
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
    service_tier?: string;
    // Server tool usage
    server_tool_use?: {
      web_search_requests?: number;
    };
    // Cache tier breakdown
    cache_creation?: {
      ephemeral_5m_input_tokens?: number;
      ephemeral_1h_input_tokens?: number;
    };
  };
  cost?: {
    input_cost?: number;
    output_cost?: number;
    cache_creation_cost?: number;
    cache_read_cost?: number;
    total_cost?: number;
  };
  // Per-model usage breakdown
  modelUsage?: Record<string, ModelUsageInfo>;
  // Permission denials
  permission_denials?: string[];
  // Request tracking
  uuid?: string;
  // Total cost in USD
  total_cost_usd?: number;
}

export type Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage;

// MCP server configuration
export interface MCPServer {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

// Import types needed for options
import type { MCPServerPermissionConfig } from './types/permissions.js';

// Main options interface
export interface ClaudeCodeOptions {
  model?: string;
  // Authentication is handled entirely by Claude Code CLI
  tools?: ToolName[];
  allowedTools?: ToolName[];
  deniedTools?: ToolName[];
  mcpServers?: MCPServer[];
  permissionMode?: PermissionMode;
  context?: string[];
  maxTokens?: number;
  temperature?: number;
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  debug?: boolean;
  // New permission management options
  mcpServerPermissions?: MCPServerPermissionConfig;
  // Configuration file path
  configFile?: string;
  // Role to apply
  role?: string;
  // System prompt override
  systemPrompt?: string;
  // AbortSignal for cancellation
  signal?: AbortSignal;
  // Session ID for conversation continuity
  sessionId?: string;
  // Additional directories to include in context
  addDirectories?: string[];
}

// Additional types for internal use - based on actual Claude Code CLI output
export interface CLIMessage {
  type: 'message';
  data: Message;
}

export interface CLIError {
  type: 'error';
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
}

export interface CLIEnd {
  type: 'end';
}

// Actual CLI output types (what the CLI actually returns)
export interface CLIAssistantOutput {
  type: 'assistant';
  message: {
    content: ContentBlock[];
  };
  session_id?: string;
}

export interface CLISystemOutput {
  type: 'system';
  subtype?: string;
  session_id?: string;
  // System init data
  model?: string;
  claude_code_version?: string;
  permissionMode?: string;
  apiKeySource?: string;
  output_style?: string;
  cwd?: string;
  uuid?: string;
  tools?: string[];
  mcp_servers?: Array<{ name: string; status: string }>;
  slash_commands?: string[];
  agents?: string[];
  skills?: string[];
}

export interface CLIResultOutput {
  type: 'result';
  subtype?: string;
  content?: string;
  session_id?: string;
  // Performance metrics
  duration_ms?: number;
  duration_api_ms?: number;
  num_turns?: number;
  // Error status
  is_error?: boolean;
  // Result text
  result?: string;
  // Usage information
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
    service_tier?: string;
    // Server tool usage
    server_tool_use?: {
      web_search_requests?: number;
    };
    // Cache tier breakdown
    cache_creation?: {
      ephemeral_5m_input_tokens?: number;
      ephemeral_1h_input_tokens?: number;
    };
  };
  cost?: {
    input_cost?: number;
    output_cost?: number;
    cache_creation_cost?: number;
    cache_read_cost?: number;
    total_cost?: number;
    total_cost_usd?: number;
  };
  // Per-model usage breakdown
  modelUsage?: Record<string, ModelUsageInfo>;
  // Permission denials
  permission_denials?: string[];
  // Request UUID
  uuid?: string;
  // Total cost in USD
  total_cost_usd?: number;
}

export interface CLIErrorOutput {
  type: 'error';
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
}

export type CLIOutput = CLIAssistantOutput | CLISystemOutput | CLIResultOutput | CLIErrorOutput | CLIMessage | CLIError | CLIEnd;

// Re-export new permission and configuration types
export * from './types/permissions.js';
export * from './types/config.js';
export * from './types/roles.js';

// Re-export enhanced error types
export * from './types/enhanced-errors.js';

// Re-export streaming types
export * from './types/streaming.js';

// Re-export per-call permission types (excluding ToolPermission which is already exported)
export {
  ToolOverrides,
  PermissionContext,
  QueryContext,
  DynamicPermissionFunction,
  PermissionResolution,
  PermissionSource,
  PermissionSourceDetails,
  ResolvedPermissions,
  PermissionResolverConfig,
  ConflictResolution,
  AdvancedPermissionOptions,
  PermissionDecision,
  ToolPermissionManager
} from './types/per-call-permissions.js';

// Re-export telemetry types
export * from './types/telemetry.js';

// Re-export retry types
export * from './types/retry.js';