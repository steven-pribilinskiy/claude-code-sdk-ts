export const DOUBLE_CLICK_THRESHOLD_MS = 500;

export const TRAIT_ICONS: Record<string, string> = {
  interactive: '💬',
  'requires-args': '⚙️',
  streaming: '📡',
  config: '📄'
};

export const UI_DIMENSIONS = {
  LIST_WIDTH: 34,
  INFO_BOX_HEIGHT_COLLAPSED: 8,
  INFO_BOX_HEIGHT_EXPANDED: 32,
  OUTPUT_BOX_TOP_COLLAPSED: 11,
  OUTPUT_BOX_TOP_EXPANDED: 35,
  OUTPUT_BOX_HEIGHT_COLLAPSED: '100%-14',
  OUTPUT_BOX_HEIGHT_EXPANDED: '100%-38',
  CONTENT_WIDTH: 30,
  ICON_WIDTH: 4,
  INDENT_WIDTH: 2
} as const;

export const EXCLUDED_DIRECTORIES = ['config', 'node_modules', 'types', 'helpers', 'menu'];

