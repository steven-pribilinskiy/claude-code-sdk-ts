import blessed from 'blessed';

export function createLiveQueryBox(): blessed.Widgets.BoxElement {
  return blessed.box({
    top: '62%',
    left: 25,
    right: 0,
    height: '37%',
    label: ' {bold}🔴 Live SDK Query{/bold} ',
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
    keys: true,
    vi: true,
    mouse: true,
    content: '{gray-fg}Press {bold}l{/bold} to run a live SDK query and see real results here...{/gray-fg}'
  });
}

