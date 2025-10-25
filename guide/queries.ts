export function getContextualQuery(currentSection: string): string {
  const queries: Record<string, string> = {
    'SDK': 'What is the Claude Code SDK and how does it wrap the Claude Code CLI?',
    'Getting Started': 'Describe the Claude Code SDK for TypeScript and its main features.',
    'Available Tools': 'List and explain the main tools available in Claude Code SDK and their purposes.',
    'Models': 'Compare Claude Haiku and Claude Sonnet models - their strengths and use cases.',
    'Permission Modes': 'Explain the three permission modes in Claude Code and when to use each.',
    'Configuration Options': 'What are the main configuration options available in ClaudeCodeOptions?',
    'Response Parsers': 'Name the 5 main response parsing methods available in Claude Code SDK.',
    'Fluent API Methods': 'Describe the chainable methods available in the fluent API QueryBuilder.',
    'Session Features': 'Explain how session management works in Claude Code SDK.',
    'CLAUDE CODE': 'What are the extended features and capabilities of Claude Code beyond the SDK?',
    'MCP Servers': 'What is Model Context Protocol and how does it extend Claude Code capabilities?',
    'Examples': 'What types of examples are available for learning Claude Code SDK?',
    'Subagents': 'What are subagents in Claude Code and how can they be used?',
    'Skills': 'Describe what Skills are and how to invoke them in Claude Code.',
    'Plugins': 'Explain what Plugins are and how they integrate with Claude Code.'
  };
  return queries[currentSection] || 'Tell me about the Claude Code SDK.';
}

export type ResultMessage = {
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
  cost?: {
    input_cost?: number;
    output_cost?: number;
    cache_read_cost?: number;
    cache_creation_cost?: number;
    total_cost?: number;
  };
};

