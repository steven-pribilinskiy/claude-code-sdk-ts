import blessed from 'blessed';

export function createRightPanel(): blessed.Widgets.BoxElement {
  return blessed.box({
    top: 2,
    left: 25,
    right: 0,
    height: '60%',
    label: ' {bold}📋 Details{/bold} ',
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
    mouse: true
  });
}

