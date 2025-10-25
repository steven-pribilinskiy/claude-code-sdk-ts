import type { CategoryData } from '../types.js';
import type { ToolName } from '../../dist/index.js';
import { TOOLS_COUNT, TOOL_CATEGORIES, TOOL_DESCRIPTIONS } from '../constants.js';
import { highlightCode } from '../utils.js';

export function getAvailableToolsPage(): CategoryData {
  let content = '{bold}{cyan-fg}Tool Capabilities{/}\n\n';
  
  for (const [category, tools] of Object.entries(TOOL_CATEGORIES)) {
    content += `{yellow-fg}${category}:{/}\n`;
    for (const tool of tools) {
      const description = TOOL_DESCRIPTIONS[tool as ToolName];
      content += `{green-fg}${tool}{/} - ${description}\n`;
    }
    content += '\n';
  }
  
  content += `{bold}Usage Example:{/}
${highlightCode(`await claude()
  .allowTools('Read', 'Grep', 'LS')
  .query('Find all TypeScript files')
  .asText();`)}`;

  return {
    title: `Available Tools (${TOOLS_COUNT} total)`,
    content
  };
}

