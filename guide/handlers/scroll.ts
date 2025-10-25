import type blessed from 'blessed';

export function setupScrollHandlers(
  rightPanel: blessed.Widgets.BoxElement,
  liveQueryBox: blessed.Widgets.BoxElement,
  screen: blessed.Widgets.Screen
): void {
  rightPanel.key(['up', 'k'], () => {
    rightPanel.scroll(-1);
    screen.render();
  });

  rightPanel.key(['down', 'j'], () => {
    rightPanel.scroll(1);
    screen.render();
  });

  rightPanel.key(['S-up', 'prior', 'pageup'], () => {
    rightPanel.scroll(-10);
    screen.render();
  });

  rightPanel.key(['S-down', 'next', 'pagedown'], () => {
    rightPanel.scroll(10);
    screen.render();
  });

  rightPanel.key(['C-home', 'home'], () => {
    rightPanel.setScrollPerc(0);
    screen.render();
  });

  rightPanel.key(['C-end', 'end'], () => {
    rightPanel.setScrollPerc(100);
    screen.render();
  });

  liveQueryBox.key(['up', 'k'], () => {
    liveQueryBox.scroll(-1);
    screen.render();
  });

  liveQueryBox.key(['down', 'j'], () => {
    liveQueryBox.scroll(1);
    screen.render();
  });

  liveQueryBox.key(['S-up', 'prior', 'pageup'], () => {
    liveQueryBox.scroll(-10);
    screen.render();
  });

  liveQueryBox.key(['S-down', 'next', 'pagedown'], () => {
    liveQueryBox.scroll(10);
    screen.render();
  });

  liveQueryBox.key(['C-home', 'home'], () => {
    liveQueryBox.setScrollPerc(0);
    screen.render();
  });

  liveQueryBox.key(['C-end', 'end'], () => {
    liveQueryBox.setScrollPerc(100);
    screen.render();
  });
}

