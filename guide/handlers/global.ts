import type blessed from 'blessed';
import type { AppState } from '../state.js';

export function setupGlobalHandlers(
  screen: blessed.Widgets.Screen,
  helpBar: blessed.Widgets.BoxElement,
  liveQueryBox: blessed.Widgets.BoxElement,
  state: AppState,
  runLiveQuery: () => Promise<void>
): void {
  const updateHelpBar = (): void => {
    helpBar.setContent(`\n Model: {bold}{cyan-fg}${state.currentModel}{/cyan-fg}{/bold} | {bold}m{/bold} Switch | {bold}r{/bold} Reload | {bold}↑↓/PgUp/PgDn{/bold} Nav | {bold}Home/End{/bold} Jump | {bold}l{/bold} Live Query | {bold}Tab{/bold} Panel | {bold}q{/bold} Quit`);
    screen.render();
  };

  screen.key(['l'], () => {
    runLiveQuery();
  });

  screen.key(['m'], () => {
    state.currentModel = state.currentModel === 'haiku' ? 'sonnet' : 'haiku';
    updateHelpBar();
  });

  screen.key(['r'], () => {
    liveQueryBox.setContent('{yellow-fg}Reloading...{/yellow-fg}');
    screen.render();
    
    setTimeout(() => {
      process.exit(0);
    }, 100);
  });

  screen.key(['q', 'C-c'], () => {
    return process.exit(0);
  });
}

