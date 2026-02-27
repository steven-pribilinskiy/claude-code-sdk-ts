#!/usr/bin/env tsx

import blessed from 'blessed';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  createTitleBox,
  createExamplesList,
  createInfoBox,
  createOutputBox,
  createStatusBar
} from './components/index.js';
import { findExamples, buildSortedExamples, buildListItems } from './core/index.js';
import { createProcessRunner } from './core/process-runner.js';
import { createUIUpdaters } from './core/ui-updates.js';
import { setupListHandlers, setupGlobalHandlers, setupFocusHandlers } from './handlers/index.js';
import { createAppState } from './state.js';
import type { BlessedList } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main(): Promise<void> {
  const examples = await findExamples(__dirname);
  const allExamples = buildSortedExamples(examples);
  const { items, itemToExample } = buildListItems(allExamples);

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Claude Code SDK Examples',
    fullUnicode: true
  });

  const titleBox = createTitleBox();
  const list = createExamplesList();
  const infoBox = createInfoBox();
  const outputBox = createOutputBox();
  const statusBar = createStatusBar();

  screen.append(titleBox);
  screen.append(list);
  screen.append(infoBox);
  screen.append(outputBox);
  screen.append(statusBar);

  list.setItems(items);

  const state = createAppState();

  const uiUpdaters = createUIUpdaters(
    infoBox,
    outputBox,
    statusBar,
    list,
    screen,
    state,
    allExamples
  );

  const processRunner = createProcessRunner(
    outputBox,
    screen,
    state,
    uiUpdaters.updateStatus,
    uiUpdaters.updateInfoBox,
    uiUpdaters.updateListWithRunningIndicator,
    __dirname
  );

  setupListHandlers(
    list,
    state,
    itemToExample,
    processRunner.runExample,
    uiUpdaters.updateInfoBox
  );

  setupGlobalHandlers(
    screen,
    outputBox,
    state,
    uiUpdaters.updateStatus,
    uiUpdaters.updateHelpBar,
    uiUpdaters.updateBoxSizes,
    uiUpdaters.updateInfoBox,
    processRunner.runExample,
    processRunner.stopCurrentProcess
  );

  setupFocusHandlers(list, infoBox, outputBox, screen);

  list.focus();
  
  let firstExampleIndex = 0;
  for (let i = 0; i < items.length; i++) {
    if (itemToExample.has(i)) {
      firstExampleIndex = i;
      break;
    }
  }
  
  const blessedList = list as unknown as BlessedList;
  blessedList.select(firstExampleIndex);
  const firstExample = itemToExample.get(firstExampleIndex);
  if (firstExample) {
    state.selectedExample = firstExample;
    uiUpdaters.updateInfoBox(firstExample);
  }
  
  outputBox.log('{gray-fg}Select an example and press Enter to run it.{/gray-fg}');
  outputBox.log('{gray-fg}Output will appear here in real-time.{/gray-fg}');
  
  uiUpdaters.updateStatus('Ready', 'green');
  screen.render();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

