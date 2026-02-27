import blessed from 'blessed';
import { UI_DIMENSIONS } from '../constants.js';

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

