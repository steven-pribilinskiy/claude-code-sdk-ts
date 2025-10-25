import type blessed from 'blessed';
import type { Example, BlessedList, AppState } from '../types.js';
import { DOUBLE_CLICK_THRESHOLD_MS } from '../constants.js';

export function setupListHandlers(
  list: blessed.Widgets.ListElement,
  state: AppState,
  itemToExample: Map<number, Example>,
  runExample: (example: Example) => void,
  updateInfoBox: (example: Example | null, isRunning?: boolean) => void
): void {
  function getSelectedExample(): Example | null {
    const blessedList = list as unknown as BlessedList;
    return itemToExample.get(blessedList.selected) || null;
  }

  list.on('select', (item, index) => {
    const example = itemToExample.get(index);
    if (example) {
      state.selectedExample = example;
      const now = Date.now();
      const timeSinceLastClick = now - state.lastClickTime;

      if (state.lastClickedExample?.fullPath === example.fullPath && timeSinceLastClick < DOUBLE_CLICK_THRESHOLD_MS) {
        runExample(example);
        state.lastClickedExample = null;
        state.lastClickTime = 0;
      } else {
        state.lastClickedExample = example;
        state.lastClickTime = now;
      }
    }
  });

  list.on('select item', (item, index) => {
    const example = itemToExample.get(index);
    if (example) {
      state.selectedExample = example;
      updateInfoBox(example, state.currentProcess?.isRunning && 
        state.currentProcess.example.fullPath === example.fullPath);
    }
  });

  list.key(['down'], () => {
    const blessedList = list as unknown as BlessedList;
    blessedList.down();
    state.lastClickedExample = null;
    state.lastClickTime = 0;
  });

  list.key(['j'], () => {
    const blessedList = list as unknown as BlessedList;
    blessedList.down();
    state.lastClickedExample = null;
    state.lastClickTime = 0;
  });

  list.key(['up'], () => {
    const blessedList = list as unknown as BlessedList;
    blessedList.up();
    state.lastClickedExample = null;
    state.lastClickTime = 0;
  });

  list.key(['k'], () => {
    const blessedList = list as unknown as BlessedList;
    blessedList.up();
    state.lastClickedExample = null;
    state.lastClickTime = 0;
  });

  list.key(['enter', 'space'], () => {
    const example = getSelectedExample();
    if (example) {
      state.selectedExample = example;
      runExample(example);
      state.lastClickedExample = null;
      state.lastClickTime = 0;
    }
  });
}

