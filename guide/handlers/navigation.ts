import type blessed from 'blessed';
import type { SdkDataRecord } from '../types.js';

export function setupNavigationHandlers(
  leftPanel: blessed.Widgets.ListElement,
  rightPanel: blessed.Widgets.BoxElement,
  liveQueryBox: blessed.Widgets.BoxElement,
  screen: blessed.Widgets.Screen,
  categories: string[],
  parentSections: string[],
  sections: SdkDataRecord,
  updateCurrentSection: (section: string) => void
): void {
  const isParentSection = (name: string): boolean => parentSections.includes(name);

  const updateRightPanel = (index: number): void => {
    const category = categories[index];
    const section = sections[category];

    updateCurrentSection(category);
    rightPanel.setLabel(` {bold}${section.title}{/bold} `);
    rightPanel.setContent(section.content);
    rightPanel.setScrollPerc(0);
    screen.render();
  };

  const getNextSelectableIndex = (startIndex: number, direction: 1 | -1): number => {
    let index = startIndex + direction;
    while (index >= 0 && index < categories.length && isParentSection(categories[index])) {
      index += direction;
    }
    return Math.max(0, Math.min(categories.length - 1, index));
  };

  leftPanel.on('select', (_item, index) => {
    if (isParentSection(categories[index])) {
      const nextIndex = getNextSelectableIndex(index, 1);
      leftPanel.select(nextIndex);
      updateRightPanel(nextIndex);
    } else {
      updateRightPanel(index);
    }
  });

  leftPanel.on('element click', (_el) => {
    const index = (leftPanel as unknown as { getItemIndex: (el: unknown) => number }).getItemIndex(_el);
    if (index !== -1) {
      if (isParentSection(categories[index])) {
        const nextIndex = getNextSelectableIndex(index, 1);
        leftPanel.select(nextIndex);
        updateRightPanel(nextIndex);
      } else {
        leftPanel.select(index);
        updateRightPanel(index);
      }
    }
  });

  leftPanel.on('element keypress', (_el, _ch, key) => {
    if (key.name === 'up' || key.name === 'k') {
      updateRightPanel((leftPanel as unknown as { selected: number }).selected);
    } else if (key.name === 'down' || key.name === 'j') {
      updateRightPanel((leftPanel as unknown as { selected: number }).selected);
    }
  });

  leftPanel.key(['home', 'g'], () => {
    leftPanel.select(0);
    updateRightPanel(0);
  });

  leftPanel.key(['end', 'G'], () => {
    let index = categories.length - 1;
    while (index >= 0 && isParentSection(categories[index])) {
      index--;
    }
    leftPanel.select(index);
    updateRightPanel(index);
  });

  leftPanel.key(['S-up', 'prior', 'pageup'], () => {
    const currentSelected = (leftPanel as unknown as { selected: number }).selected;
    let newIndex = Math.max(0, currentSelected - 5);
    while (newIndex > 0 && isParentSection(categories[newIndex])) {
      newIndex--;
    }
    leftPanel.select(newIndex);
    updateRightPanel(newIndex);
  });

  leftPanel.key(['S-down', 'next', 'pagedown'], () => {
    const currentSelected = (leftPanel as unknown as { selected: number }).selected;
    let newIndex = Math.min(categories.length - 1, currentSelected + 5);
    while (newIndex < categories.length - 1 && isParentSection(categories[newIndex])) {
      newIndex++;
    }
    leftPanel.select(newIndex);
    updateRightPanel(newIndex);
  });
}

