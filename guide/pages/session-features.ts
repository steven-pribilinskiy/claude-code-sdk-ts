import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getSessionFeaturesPage(): CategoryData {
  return {
    title: 'Session Management',
    content: `{bold}{cyan-fg}Session Management{/}

{yellow-fg}What are Sessions?{/}
Sessions maintain conversation context across multiple queries,
allowing Claude to remember previous interactions.

{yellow-fg}Creating a Session:{/}
${highlightCode(`const session = claude()
  .withModel('sonnet')
  .skipPermissions();

// First query
const response1 = await session
  .query('Pick a random number between 1 and 100')
  .asText();
console.log(response1); // "I picked 42"

// Continue with context - Claude remembers!
const sessionId = await session.query('').getSessionId();
const response2 = await session
  .withSessionId(sessionId)
  .query('What number did you pick?')
  .asText();
console.log(response2); // "I picked 42"`)}

{yellow-fg}Session ID Management:{/}
${highlightCode(`// Get session ID after first query
const sid = await builder.query('Hello').getSessionId();

// Reuse session ID
const builder2 = claude().withSessionId(sid);
await builder2.query('Continue conversation').asText();`)}

{yellow-fg}Use Cases:{/}
• Multi-turn conversations
• Iterative refinement
• Context preservation
• Follow-up questions
• Code review workflows

{yellow-fg}Best Practices:{/}
• Store session IDs for later use
• Use same model across session
• Be aware of token limits
• Clear sessions when starting new topics
`
  };
}

