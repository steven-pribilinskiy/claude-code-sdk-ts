import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getResponseParsersPage(): CategoryData {
  return {
    title: 'Response Parsing Methods',
    content: `{bold}{cyan-fg}Response Parser Methods{/}

{yellow-fg}1. asText(){/}
   • Returns final text response as string
   • Simplest parser
   • Filters out tool calls and system messages
${highlightCode(`const text = await claude()
  .query('Explain this')
  .asText();`)}

{yellow-fg}2. asJSON<T>(){/}
   • Parses response as JSON
   • Type-safe with TypeScript generics
   • Throws if response is not valid JSON
${highlightCode(`const data = await claude()
  .query('Return JSON array')
  .asJSON<string[]>();`)}

{yellow-fg}3. asResult(){/}
   • Returns complete result with metadata
   • Includes usage stats, cost, and all messages
   • Access: result.content, result.usage, result.cost
${highlightCode(`const result = await claude()
  .query('Task')
  .asResult();
console.log(result.usage.totalTokens);`)}

{yellow-fg}4. asToolExecutions(){/}
   • Returns array of tool execution summaries
   • Shows which tools were used
   • Indicates success/failure
${highlightCode(`const tools = await claude()
  .allowTools('Read', 'Grep')
  .query('Find files')
  .asToolExecutions();

for (const exec of tools) {
  console.log(\`\${exec.tool}: \${exec.isError ? 'Failed' : 'Success'}\`);
}`)}

{yellow-fg}5. stream(callback){/}
   • Stream messages as they arrive
   • Process in real-time
${highlightCode(`await claude()
  .query('Task')
  .stream(async (msg) => {
    if (msg.type === 'assistant') {
      console.log(msg.content);
    }
  });`)}
`
  };
}

