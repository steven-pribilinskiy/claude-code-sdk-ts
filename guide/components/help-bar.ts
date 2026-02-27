import blessed from 'blessed';

export function createHelpBar(): blessed.Widgets.BoxElement {
  return blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '\n Model: {bold}{cyan-fg}haiku{/cyan-fg}{/bold} | {bold}m{/bold} Switch | {bold}r{/bold} Reload | {bold}↑↓/PgUp/PgDn{/bold} Nav | {bold}Home/End{/bold} Jump | {bold}l{/bold} Live Query | {bold}Tab{/bold} Panel | {bold}q{/bold} Quit',
    tags: true,
    style: {
      fg: 'white',
      bg: 'black'
    }
  });
}

