import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getModelsPage(): CategoryData {
  return {
    title: 'Available Claude Models',
    content: `{bold}{cyan-fg}Claude Models{/}

{yellow-fg}1. Claude Haiku (haiku) - DEFAULT{/}
   • Fastest model
   • Best for simple, quick tasks
   • Lower cost
   • Use: .withModel('haiku')

{yellow-fg}2. Claude Sonnet (sonnet){/}
   • Balanced performance and speed
   • Great for most development tasks
   • Good reasoning capabilities
   • Use: .withModel('sonnet')

{yellow-fg}3. Claude Opus (opus){/}
   • Most capable model
   • Best for complex reasoning and analysis
   • Highest token limit
   • Use: .withModel('opus')

{bold}Model Selection Example:{/}
${highlightCode(`const result = await claude()
  .withModel('opus')
  .query('Analyze this complex architecture')
  .asText();`)}

{bold}Model Switching in Session:{/}
${highlightCode(`const builder = claude().withModel('sonnet');

// First query with sonnet
await builder.query('Quick task').asText();

// Switch to opus for complex task
builder.withModel('opus');
await builder.query('Complex analysis').asText();`)}
`
  };
}

