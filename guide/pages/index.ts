import { getSdkPage } from './sdk.js';
import { getGettingStartedPage } from './getting-started.js';
import { getAvailableToolsPage } from './available-tools.js';
import { getModelsPage } from './models.js';
import { getPermissionModesPage } from './permission-modes.js';
import { getConfigurationOptionsPage } from './configuration-options.js';
import { getResponseParsersPage } from './response-parsers.js';
import { getFluentApiMethodsPage } from './fluent-api-methods.js';
import { getSessionFeaturesPage } from './session-features.js';
import { getExamplesPage } from './examples.js';
import { getClaudeCodePage } from './claude-code.js';
import { getMcpServersPage } from './mcp-servers.js';
import { getSubagentsPage } from './subagents.js';
import { getSkillsPage } from './skills.js';
import { getPluginsPage } from './plugins.js';
import type { SdkDataRecord } from '../types.js';

export function buildGuideSections(sdkVersion: string): SdkDataRecord {
  return {
    'SDK': getSdkPage(sdkVersion),
    'Getting Started': getGettingStartedPage(sdkVersion),
    'Available Tools': getAvailableToolsPage(),
    'Models': getModelsPage(),
    'Permission Modes': getPermissionModesPage(),
    'Configuration Options': getConfigurationOptionsPage(),
    'Response Parsers': getResponseParsersPage(),
    'Fluent API Methods': getFluentApiMethodsPage(),
    'Session Features': getSessionFeaturesPage(),
    'Examples': getExamplesPage(),
    'CLAUDE CODE': getClaudeCodePage(),
    'MCP Servers': getMcpServersPage(),
    'Subagents': getSubagentsPage(),
    'Skills': getSkillsPage(),
    'Plugins': getPluginsPage()
  };
}

