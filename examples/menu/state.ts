import type { AppState } from './types.js';

export function createAppState(): AppState {
  return {
    currentProcess: null,
    selectedExample: null,
    lastClickedExample: null,
    lastClickTime: 0,
    isDescriptionExpanded: false,
    currentModel: 'haiku'
  };
}

