import type { CategoryData } from '../types.js';

export function getFluentApiMethodsPage(): CategoryData {
  return {
    title: 'Fluent API Method Reference',
    content: `{bold}{cyan-fg}QueryBuilder Methods{/}

{yellow-fg}Model & Config:{/}
{green-fg}.withModel(model){/} - Set Claude model
{green-fg}.withTimeout(ms){/} - Set timeout
{green-fg}.withMaxTokens(tokens){/} - Set max tokens
{green-fg}.withTemperature(temp){/} - Set temperature
{green-fg}.withSignal(signal){/} - Set AbortSignal for cancellation
{green-fg}.debug(enabled){/} - Toggle debug mode

{yellow-fg}Tools & Permissions:{/}
{green-fg}.allowTools(...tools){/} - Whitelist tools
{green-fg}.denyTools(...tools){/} - Blacklist tools
{green-fg}.withPermissions(mode){/} - Set permission mode
{green-fg}.acceptEdits(){/} - Auto-accept edits
{green-fg}.skipPermissions(){/} - Bypass all prompts

{yellow-fg}Context & Environment:{/}
{green-fg}.inDirectory(path){/} - Set working directory
{green-fg}.withContext(...ctx){/} - Add context strings
{green-fg}.withSystemPrompt(prompt){/} - Override system prompt
{green-fg}.withEnv(vars){/} - Set environment variables

{yellow-fg}MCP Integration:{/}
{green-fg}.withMCP(...servers){/} - Add MCP server(s)
{green-fg}.withMCPServerPermission(name, perm){/} - Set single MCP permission
{green-fg}.withMCPServerPermissions(perms){/} - Set multiple MCP permissions
{green-fg}.withConfig(config){/} - Apply MCP config object

{yellow-fg}Config Files:{/}
{green-fg}.withConfigFile(path){/} - Load config file (async)
{green-fg}.withRole(role){/} - Apply role from config
{green-fg}.withRolesFile(path){/} - Load roles config (async)

{yellow-fg}Sessions:{/}
{green-fg}.withSessionId(id){/} - Set session ID
{green-fg}.getSessionId(){/} - Get current session ID

{yellow-fg}Logging:{/}
{green-fg}.withLogger(logger){/} - Set custom logger

{yellow-fg}Event Handlers:{/}
{green-fg}.onMessage(callback){/} - Handle each message
{green-fg}.onAssistant(callback){/} - Handle assistant messages
{green-fg}.onToolUse(callback){/} - Handle tool usage

{yellow-fg}Execution:{/}
{green-fg}.query(prompt){/} - Set query and return response parser
{green-fg}.queryRaw(prompt){/} - Execute and return raw async generator
{green-fg}.asText(){/} - Execute and return text
{green-fg}.asJSON<T>(){/} - Execute and parse JSON
{green-fg}.asResult(){/} - Execute and return full result
{green-fg}.asToolExecutions(){/} - Execute and return tool summary
{green-fg}.stream(callback){/} - Execute with streaming
`
  };
}

