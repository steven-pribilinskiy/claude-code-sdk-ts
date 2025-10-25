import type { CategoryData } from '../types.js';

export function getClaudeCodePage(): CategoryData {
  return {
    title: 'Claude Code - Extended Features',
    content: `{bold}{cyan-fg}Claude Code - Advanced Capabilities{/}

Claude Code CLI provides extended capabilities beyond the basic SDK through specialized features.
The SDK can leverage these Claude Code features through the wrapper:

{bold}Included Features:{/}
{green-fg}• MCP Servers{/} - Model Context Protocol for custom integrations
{green-fg}• Subagents{/} - Specialized autonomous agents for complex tasks
{green-fg}• Skills{/} - Reusable capability shortcuts for common workflows
{green-fg}• Plugins{/} - Extended integration with external services

{bold}Integration with SDK:{/}
These Claude Code features can be used through the SDK:
• MCP servers configured via {bold}.withMCP(){/bold}
• Subagents launched via {bold}task(){/bold} function
• Skills invoked via {bold}skill(){/bold} function
• Plugins configured in {bold}ClaudeCodeOptions{/bold}

{bold}Use Cases:{/}
• Multi-step autonomous workflows
• Specialized expertise for different domains
• Custom tool integrations
• Team-specific automation

{bold}References:{/}
{cyan-fg}Docs:{/} https://docs.claude.com/en/docs/claude-code/
{cyan-fg}CLI:{/} npm install -g @anthropic-ai/claude-code
`
  };
}

