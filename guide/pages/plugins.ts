import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getPluginsPage(): CategoryData {
  return {
    title: 'Plugins - Extended Integration Capabilities',
    content: `{bold}{cyan-fg}Plugins Overview{/}

Plugins extend Claude Code's capabilities with specialized integrations and tools.
They enable connection to external services and custom implementations.

{yellow-fg}Documentation:{/}
{green-fg}https://docs.claude.com/en/docs/claude-code/plugins{/}

{bold}Plugin Types:{/}
{yellow-fg}• MCP Servers{/} - Model Context Protocol integrations
{yellow-fg}• Tool Plugins{/} - Custom tool implementations
{yellow-fg}• Integration Plugins{/} - External service connections
{yellow-fg}• Framework Plugins{/} - Framework-specific helpers

{bold}Model Context Protocol (MCP) Servers:{/}
MCP is the standard for extending Claude Code with custom tools:
{green-fg}• GitHub Integration{/} - Repository and workflow access
{green-fg}• Database Connections{/} - Direct DB query access
{green-fg}• API Gateways{/} - External API integration
{green-fg}• Monitoring Tools{/} - System monitoring and logs

{bold}Configuring Plugins:{/}
${highlightCode(`await claude()
  .withMCP({
    command: 'npx',
    args: ['-y', 'my-mcp-server'],
    env: { API_KEY: 'secret' }
  })
  .query('Use the plugin...')
  .asText();`)}

{bold}Creating Custom Plugins:{/}
Build specialized plugins for your workflows:
• Company-specific tools
• Custom integrations
• Domain expertise automation
• Team workflow enhancement

{bold}Best Practices:{/}
• Use with proper permission management
• Secure sensitive credentials
• Document custom plugins
• Version control plugin configs
• Test before production use
`
  };
}

