import blessed from 'blessed';

export function createLeftPanel(): blessed.Widgets.ListElement {
  return blessed.list({
    top: 2,
    left: 0,
    width: 25,
    height: '100%-5',
    label: ' {bold}📚 Sections{/bold} ',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      selected: {
        bg: 'blue',
        fg: 'white',
        bold: true
      },
      border: {
        fg: 'gray'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    },
    keys: true,
    vi: true,
    mouse: true,
    scrollbar: {
      ch: '█',
      track: {
        bg: 'black'
      },
      style: {
        inverse: true
      }
    }
  });
}

