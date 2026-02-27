import blessed from 'blessed';

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

