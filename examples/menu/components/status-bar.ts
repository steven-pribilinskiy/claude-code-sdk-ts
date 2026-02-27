import blessed from 'blessed';

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

