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

