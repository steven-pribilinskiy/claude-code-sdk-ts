import type blessed from 'blessed';

export function setupFocusHandlers(
  list: blessed.Widgets.ListElement,
  infoBox: blessed.Widgets.BoxElement,
  outputBox: blessed.Widgets.Log,
  screen: blessed.Widgets.Screen
): void {
  list.key(['tab'], () => {
    infoBox.focus();
    screen.render();
  });

  list.key(['S-tab'], () => {
    outputBox.focus();
    screen.render();
  });

  infoBox.key(['tab'], () => {
    outputBox.focus();
    screen.render();
  });

  infoBox.key(['S-tab'], () => {
    list.focus();
    screen.render();
  });

  outputBox.key(['tab'], () => {
    list.focus();
    screen.render();
  });

  outputBox.key(['S-tab'], () => {
    infoBox.focus();
    screen.render();
  });

  list.on('click', () => {
    list.focus();
    screen.render();
  });

  infoBox.on('click', () => {
    infoBox.focus();
    screen.render();
  });

  outputBox.on('click', () => {
    outputBox.focus();
    screen.render();
  });
}

