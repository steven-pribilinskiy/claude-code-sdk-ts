import type blessed from 'blessed';
import { toSentenceCase } from '../utils/string-utils.js';
import type { Example, AppState } from '../types.js';
import { UI_DIMENSIONS } from '../constants.js';

export function createUIUpdaters(
  infoBox: blessed.Widgets.BoxElement,
  outputBox: blessed.Widgets.BoxElement,
  statusBar: blessed.Widgets.BoxElement,
  list: blessed.Widgets.ListElement,
  screen: blessed.Widgets.Screen,
  state: AppState,
  allExamples: Example[]
) {
  function updateHelpBar(): void {
    statusBar.setContent(`\n Model: {bold}{cyan-fg}${state.currentModel}{/cyan-fg}{/bold} | {bold}m{/bold} Switch | {bold}↑↓{/bold} Nav  {bold}Enter{/bold} Run  {bold}r{/bold} Restart  {bold}s{/bold} Stop  {bold}c{/bold} Clear  {bold}d{/bold} Expand/Collapse Desc  {bold}y{/bold} Copy  {bold}Tab{/bold} Focus  {bold}q{/bold} Quit`);
    screen.render();
  }

  function updateBoxSizes(): void {
    if (state.isDescriptionExpanded) {
      infoBox.height = UI_DIMENSIONS.INFO_BOX_HEIGHT_EXPANDED;
      outputBox.top = UI_DIMENSIONS.OUTPUT_BOX_TOP_EXPANDED;
      outputBox.height = UI_DIMENSIONS.OUTPUT_BOX_HEIGHT_EXPANDED;
    } else {
      infoBox.height = UI_DIMENSIONS.INFO_BOX_HEIGHT_COLLAPSED;
      outputBox.top = UI_DIMENSIONS.OUTPUT_BOX_TOP_COLLAPSED;
      outputBox.height = UI_DIMENSIONS.OUTPUT_BOX_HEIGHT_COLLAPSED;
    }
    screen.render();
  }

  function updateInfoBox(example: Example | null, isRunning: boolean = false): void {
    if (!example) {
      infoBox.setContent('{gray-fg}Select an example to see details{/gray-fg}');
    } else {
      const status = isRunning ? '{yellow-fg}⚡ RUNNING{/yellow-fg}' : '{gray-fg}Ready{/gray-fg}';
      const description = state.isDescriptionExpanded 
        ? example.longDescription 
        : example.shortDescription;
      const content = [
        `{bold}{cyan-fg}Name:{/cyan-fg}{/bold} ${example.name} ${status}`,
        `{bold}{cyan-fg}Path:{/cyan-fg}{/bold} {gray-fg}${example.path}{/gray-fg}`,
        '',
        `{bold}{cyan-fg}Description:{/cyan-fg}{/bold}`,
        `{gray-fg}${description}{/gray-fg}`
      ].join('\n');
      infoBox.setContent(content);
    }
    screen.render();
  }

  function updateListWithRunningIndicator(): void {
    const newItems: string[] = [];
    let currentCat = '';
    let itemIdx = 0;

    allExamples.forEach((example) => {
      if (example.category !== currentCat) {
        newItems.push(`{bold}{cyan-fg}${example.category}{/cyan-fg}{/bold}`);
        itemIdx++;
        currentCat = example.category;
      }

      const displayName = toSentenceCase(example.name);
      const isRunning = state.currentProcess?.isRunning &&
                       state.currentProcess.example.fullPath === example.fullPath;
      const indicator = isRunning ? '⚡' : '';
      const iconSuffix = example.icon || '';
      const allIcons = [iconSuffix, indicator].filter(i => i).join('');

      const contentWidth = 30;
      const iconWidth = 4;
      const titleWidth = contentWidth - iconWidth - 2;

      let line = '  ';
      line += displayName.padEnd(titleWidth, ' ');
      line += allIcons.padStart(iconWidth, ' ');

      newItems.push(line);
      itemIdx++;
    });

    const blessedList = list as unknown as { selected: number; select(index: number): void };
    const currentSelected = blessedList.selected;
    list.setItems(newItems);
    blessedList.select(currentSelected);
    screen.render();
  }

  function updateStatus(message: string, color: string = 'white'): void {
    statusBar.setContent(
      `\n Model: {bold}{cyan-fg}${state.currentModel}{/cyan-fg}{/bold} | {bold}m{/bold} Switch | {bold}↑↓{/bold} Nav  {bold}Enter{/bold} Run  {bold}r{/bold} Restart  {bold}s{/bold} Stop  {bold}c{/bold} Clear  {bold}d{/bold} Expand/Collapse Desc  {bold}y{/bold} Copy  {bold}Tab{/bold} Focus  {bold}q{/bold} Quit  {${color}-fg}${message}{/${color}-fg}`
    );
    screen.render();
  }

  return {
    updateHelpBar,
    updateBoxSizes,
    updateInfoBox,
    updateListWithRunningIndicator,
    updateStatus
  };
}

