import blessed from 'blessed';
import { UI_DIMENSIONS } from '../constants.js';

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

