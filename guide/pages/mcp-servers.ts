import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getMcpServersPage(): CategoryData {
  return {
    title: 'Model Context Protocol (MCP)',
    content: `{bold}{cyan-fg}MCP Server Integration{/}

{yellow-fg}What is MCP?{/}
Model Context Protocol extends Claude's capabilities with
custom tools and integrations (databases, APIs, etc.)

{yellow-fg}Adding MCP Servers:{/}
${highlightCode(`await claude()
  .withMCP({
    command: 'my-mcp-server',
    args: ['--config', '/path/to/config'],
    env: { API_KEY: 'secret' }
  })
  .query('Use MCP functionality')
  .asText();`)}

{yellow-fg}Server Permissions:{/}
${highlightCode(`await claude()
  .withMCPServerPermission('database-mcp', 'whitelist')
  .withMCPServerPermission('file-mcp', 'ask')
  .query('Query database')
  .asText();`)}

{yellow-fg}Permission Levels:{/}
• {green-fg}whitelist{/} - Always allow
• {green-fg}blacklist{/} - Always deny
• {green-fg}ask{/} - Prompt for permission

{yellow-fg}Common MCP Servers:{/}
• file-system-mcp - Enhanced file operations
• database-mcp - Database connectivity
• git-mcp - Git operations
• api-mcp - API integrations
• visualization-mcp - Data visualization

{yellow-fg}Config File Example:{/}
${highlightCode(`// mcpconfig.json
{
  "mcpServers": {
    "database-mcp": {
      "defaultPermission": "whitelist",
      "command": "npx",
      "args": ["-y", "database-mcp"],
      "env": { "DB_URL": "postgresql://..." }
    }
  }
}`)}

{bold}Load from config:{/}
${highlightCode(`await claude()
  .withConfigFile('./mcpconfig.json')
  .query('Query database')
  .asText();`)}
`
  };
}

