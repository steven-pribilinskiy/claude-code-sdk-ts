import blessed from 'blessed';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { SdkDataRecord } from './types.js';
import {
  getSdkPage,
  getGettingStartedPage,
  getAvailableToolsPage,
  getModelsPage,
  getPermissionModesPage,
  getConfigurationOptionsPage,
  getResponseParsersPage,
  getFluentApiMethodsPage,
  getSessionFeaturesPage,
  getExamplesPage,
  getClaudeCodePage,
  getMcpServersPage,
  getSubagentsPage,
  getSkillsPage,
  getPluginsPage
} from './pages/index.js';
import {
  createTitleBar,
  createLeftPanel,
  createRightPanel,
  createLiveQueryBox,
  createHelpBar
} from './components.js';
import { createAppState } from './state.js';
import {
  setupNavigationHandlers,
  setupScrollHandlers,
  setupFocusHandlers,
  setupGlobalHandlers
} from './handlers/index.js';
import { createLiveQueryRunner } from './live-query.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const SDK_VERSION = packageJson.version;

function buildSdkData(): SdkDataRecord {
  return {
    'SDK': getSdkPage(SDK_VERSION),
    'Getting Started': getGettingStartedPage(SDK_VERSION),
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

const sdkData = buildSdkData();
const categories = Object.keys(sdkData);
const parentSections = ['SDK', 'CLAUDE CODE'];

const screen = blessed.screen({
  smartCSR: true,
  title: 'Claude Code SDK Interactive Guide',
  fullUnicode: true
});

const titleBar = createTitleBar(SDK_VERSION);
const leftPanel = createLeftPanel();
const rightPanel = createRightPanel();
const liveQueryBox = createLiveQueryBox();
const helpBar = createHelpBar();

screen.append(titleBar);
screen.append(leftPanel);
screen.append(rightPanel);
screen.append(liveQueryBox);
screen.append(helpBar);

const displayItems = categories.map(cat => {
  if (parentSections.includes(cat)) {
    return `{bold}{yellow-fg}${cat}{/}`;
  } else {
    return `  ${cat}`;
  }
});

leftPanel.setItems(displayItems);

const state = createAppState();

const updateCurrentSection = (section: string): void => {
  state.currentSection = section;
};

const runLiveQuery = createLiveQueryRunner(liveQueryBox, screen, state);

setupNavigationHandlers(
  leftPanel,
  rightPanel,
  liveQueryBox,
  screen,
  categories,
  parentSections,
  sdkData,
  updateCurrentSection
);

setupScrollHandlers(rightPanel, liveQueryBox, screen);
setupFocusHandlers(leftPanel, rightPanel, liveQueryBox, screen);
setupGlobalHandlers(screen, helpBar, liveQueryBox, state, runLiveQuery);

leftPanel.focus();
leftPanel.select(0);

const data = sdkData[categories[0]];
rightPanel.setLabel(` {bold}${data.title}{/bold} `);
rightPanel.setContent(data.content);
rightPanel.setScrollPerc(0);

screen.render();
