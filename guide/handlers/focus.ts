import type blessed from 'blessed';

export function setupFocusHandlers(
  leftPanel: blessed.Widgets.ListElement,
  rightPanel: blessed.Widgets.BoxElement,
  liveQueryBox: blessed.Widgets.BoxElement,
  screen: blessed.Widgets.Screen
): void {
  leftPanel.key(['tab'], () => {
    rightPanel.focus();
  });

  leftPanel.key(['S-tab'], () => {
    liveQueryBox.focus();
  });

  rightPanel.key(['tab'], () => {
    liveQueryBox.focus();
  });

  rightPanel.key(['S-tab'], () => {
    leftPanel.focus();
  });

  liveQueryBox.key(['tab'], () => {
    leftPanel.focus();
  });

  liveQueryBox.key(['S-tab'], () => {
    rightPanel.focus();
  });

  leftPanel.on('click', () => {
    leftPanel.focus();
    screen.render();
  });

  rightPanel.on('click', () => {
    rightPanel.focus();
    screen.render();
  });

  liveQueryBox.on('click', () => {
    liveQueryBox.focus();
    screen.render();
  });
}

