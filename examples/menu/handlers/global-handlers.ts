import type blessed from 'blessed';
import { copyToClipboard } from '../../helpers/clipboard.js';
import type { AppState, Example } from '../types.js';

export function setupGlobalHandlers(
  screen: blessed.Widgets.Screen,
  outputBox: blessed.Widgets.Log,
  state: AppState,
  updateStatus: (message: string, color?: string) => void,
  updateHelpBar: () => void,
  updateBoxSizes: () => void,
  updateInfoBox: (example: Example | null, isRunning?: boolean) => void,
  runExample: (example: Example) => void,
  stopCurrentProcess: () => void
): void {
  screen.key(['r'], () => {
    if (state.currentProcess?.example) {
      runExample(state.currentProcess.example);
    } else if (state.selectedExample) {
      runExample(state.selectedExample);
    }
    state.lastClickedExample = null;
    state.lastClickTime = 0;
  });

  screen.key(['s'], () => {
    if (state.currentProcess?.isRunning) {
      stopCurrentProcess();
      outputBox.log('\n{yellow-fg}{bold}⚠{/bold} Process stopped by user{/yellow-fg}');
      updateStatus('Stopped', 'yellow');
      screen.render();
    }
  });

  screen.key(['c'], () => {
    outputBox.setContent('');
    outputBox.log('{gray-fg}Output cleared{/gray-fg}');
    updateStatus('Ready', 'green');
    screen.render();
  });

  screen.key(['d'], () => {
    state.isDescriptionExpanded = !state.isDescriptionExpanded;
    updateBoxSizes();
    if (state.selectedExample) {
      const isRunning = state.currentProcess?.isRunning && 
        state.currentProcess.example.fullPath === state.selectedExample.fullPath;
      updateInfoBox(state.selectedExample, isRunning);
    }
    const statusMessage = state.isDescriptionExpanded 
      ? 'Description expanded' 
      : 'Description collapsed';
    updateStatus(statusMessage, 'cyan');
    setTimeout(() => {
      updateStatus('Ready', 'green');
    }, 2000);
  });

  screen.key(['m'], () => {
    state.currentModel = state.currentModel === 'haiku' ? 'sonnet' : 'haiku';
    updateHelpBar();
  });

  screen.key(['y'], async () => {
    if (state.currentProcess && state.currentProcess.outputLines.length > 0) {
      const output = state.currentProcess.outputLines.join('');
      const success = await copyToClipboard(output);
      if (success) {
        updateStatus('Output copied to clipboard!', 'green');
      } else {
        updateStatus('Failed to copy (install xclip/xsel/pbcopy)', 'red');
      }
      setTimeout(() => {
        updateStatus('Ready', 'green');
      }, 2000);
    }
  });

  screen.key(['escape', 'q', 'C-c'], () => {
    stopCurrentProcess();
    return process.exit(0);
  });
}

