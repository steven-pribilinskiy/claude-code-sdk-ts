import blessed from 'blessed';
import { UI_DIMENSIONS } from '../constants.js';

export function createTitleBox(): blessed.Widgets.BoxElement {
  return blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '\n{center}{bold}Claude Code SDK - TypeScript Examples{/bold}{/center}',
    tags: true,
    style: {
      fg: 'white',
      bg: 'blue',
      bold: true
    }
  });
}

export function createExamplesList(): blessed.Widgets.ListElement {
  return blessed.list({
    top: 3,
    left: 0,
    width: UI_DIMENSIONS.LIST_WIDTH,
    height: '100%-6',
    label: ' {bold}📁 SDK Examples{/bold} ',
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    border: {
      type: 'line'
    },
    style: {
      selected: {
        bg: 'blue',
        fg: 'white',
        bold: true
      },
      border: {
        fg: 'gray'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    },
    scrollbar: {
      ch: '█',
      track: {
        bg: 'black'
      },
      style: {
        inverse: true
      }
    }
  });
}

export function createInfoBox(): blessed.Widgets.BoxElement {
  return blessed.box({
    top: 3,
    left: UI_DIMENSIONS.LIST_WIDTH,
    width: `100%-${UI_DIMENSIONS.LIST_WIDTH}`,
    height: UI_DIMENSIONS.INFO_BOX_HEIGHT_COLLAPSED,
    label: ' {bold}📋 Info{/bold} ',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'gray'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    },
    padding: {
      left: 1,
      right: 1
    },
    keys: true,
    vi: true,
    mouse: true
  });
}

export function createOutputBox(): blessed.Widgets.Log {
  return blessed.log({
    top: UI_DIMENSIONS.OUTPUT_BOX_TOP_COLLAPSED,
    left: UI_DIMENSIONS.LIST_WIDTH,
    width: `100%-${UI_DIMENSIONS.LIST_WIDTH}`,
    height: UI_DIMENSIONS.OUTPUT_BOX_HEIGHT_COLLAPSED,
    label: ' {bold}📺 Output{/bold} ',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'gray'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: '█',
      track: {
        bg: 'black'
      },
      style: {
        inverse: true
      }
    },
    mouse: true,
    keys: true,
    vi: true
  });
}

export function createStatusBar(): blessed.Widgets.BoxElement {
  return blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '\n Model: {bold}{cyan-fg}haiku{/cyan-fg}{/bold} | {bold}m{/bold} Switch | {bold}↑↓{/bold} Nav  {bold}Enter{/bold} Run  {bold}r{/bold} Restart  {bold}s{/bold} Stop  {bold}c{/bold} Clear  {bold}d{/bold} Expand/Collapse Desc  {bold}y{/bold} Copy  {bold}Tab{/bold} Focus  {bold}q{/bold} Quit',
    tags: true,
    style: {
      fg: 'white',
      bg: 'black'
    }
  });
}

