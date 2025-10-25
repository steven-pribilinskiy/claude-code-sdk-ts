import blessed from 'blessed';

export function createTitleBar(sdkVersion: string): blessed.Widgets.BoxElement {
  return blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 2,
    align: 'center',
    valign: 'middle',
    content: `{bold}Claude Code SDK Interactive Guide v${sdkVersion}{/bold}\n{bold}{cyan-fg}Explore SDK Features and Capabilities{/cyan-fg}{/bold}`,
    tags: true,
    style: {
      fg: 'white',
      bg: 'blue'
    }
  });
}

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

