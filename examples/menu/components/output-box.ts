import blessed from 'blessed';
import { UI_DIMENSIONS } from '../constants.js';

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

