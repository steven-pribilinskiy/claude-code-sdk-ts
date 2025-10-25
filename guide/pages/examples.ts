import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getExamplesPage(): CategoryData {
  return {
    title: 'Example Files',
    content: `{bold}{cyan-fg}Available Examples{/}

{yellow-fg}Core Examples:{/}
{green-fg}hello-world.ts{/} - Simplest example
{green-fg}file-operations.ts{/} - File manipulation
{green-fg}code-analysis.ts{/} - Code analysis patterns
{green-fg}interactive-session.ts{/} - Interactive CLI
{green-fg}web-research.ts{/} - Web research tasks
{green-fg}project-scaffolding.ts{/} - Create projects
{green-fg}error-handling.ts{/} - Error patterns

{yellow-fg}Advanced Examples:{/}
{green-fg}fluent-api-demo.ts{/} - Fluent API showcase
{green-fg}response-parsing-demo.ts{/} - Response handling
{green-fg}new-features-demo.ts{/} - MCP & roles
{green-fg}enhanced-features-demo.ts{/} - v0.3.0 features
{green-fg}production-features.ts{/} - Production patterns
{green-fg}sessions.ts{/} - Session management
{green-fg}sdk-guide.ts{/} - This guide!

{yellow-fg}Running Examples:{/}
{green-fg}cd examples/fluent-api
npx tsx hello-world.ts
npx tsx file-operations.ts
npx tsx interactive-session.ts{/}

{yellow-fg}With Arguments:{/}
{green-fg}npx tsx project-scaffolding.ts react-app my-project
npx tsx interactive-session.ts developer{/}

{yellow-fg}Learn More:{/}
• Check examples/README.md for details
• Review docs/ directory for guides
• Visit GitHub repository for updates
• Join community discussions

{bold}Quick Test:{/}
${highlightCode(`// Create hello-world.ts
import { claude } from '@instantlyeasy/claude-code-sdk-ts';

const result = await claude()
  .query('Say "Hello from Claude!"')
  .asText();

console.log(result);`)}
`
  };
}

