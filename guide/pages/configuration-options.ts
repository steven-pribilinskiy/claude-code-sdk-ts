import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getConfigurationOptionsPage(): CategoryData {
  return {
    title: 'SDK Configuration Options',
    content: `{bold}{cyan-fg}ClaudeCodeOptions Interface{/}

{yellow-fg}Model & Behavior:{/}
{green-fg}model{/} - Claude model to use (opus/sonnet/haiku)
{green-fg}temperature{/} - Randomness (0.0-1.0)
{green-fg}maxTokens{/} - Maximum response tokens
{green-fg}timeout{/} - Query timeout in milliseconds

{yellow-fg}Tools & Permissions:{/}
{green-fg}allowedTools{/} - Whitelist of allowed tools
{green-fg}deniedTools{/} - Blacklist of denied tools
{green-fg}permissionMode{/} - Permission handling mode

{yellow-fg}Context & Environment:{/}
{green-fg}cwd{/} - Working directory
{green-fg}context{/} - Additional context strings
{green-fg}addDirectories{/} - Extra directories for context
{green-fg}env{/} - Environment variables

{yellow-fg}Advanced:{/}
{green-fg}mcpServers{/} - MCP server configurations
{green-fg}mcpServerPermissions{/} - Per-server permissions
{green-fg}systemPrompt{/} - Override system prompt
{green-fg}signal{/} - AbortSignal for cancellation
{green-fg}sessionId{/} - Session identifier
{green-fg}debug{/} - Enable debug logging

{yellow-fg}Config Files:{/}
{green-fg}configFile{/} - Path to config file (JSON/YAML)
{green-fg}role{/} - Role name from roles config

{bold}Example:{/}
${highlightCode(`await claude()
  .withModel('opus')
  .withTimeout(60000)
  .inDirectory('/path/to/project')
  .debug(true)
  .query('Task')
  .asText();`)}
`
  };
}

