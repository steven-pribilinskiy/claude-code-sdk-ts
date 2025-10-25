import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getSubagentsPage(): CategoryData {
  return {
    title: 'Subagents - Specialized Task Agents',
    content: `{bold}{cyan-fg}Subagents Overview{/}

Subagents are specialized agents that can be launched to handle complex, multi-step tasks autonomously.
They operate independently and can be created for specific workflows.

{yellow-fg}Documentation:{/}
{green-fg}https://docs.claude.com/en/docs/claude-code/sub-agents{/}

{bold}Types of Subagents:{/}
{yellow-fg}• general-purpose{/} - Research, code execution, multi-step tasks
{yellow-fg}• frontend-expert{/} - React, Vue, Angular, CSS/styling
{yellow-fg}• backend-expert{/} - APIs, databases, server infrastructure
{yellow-fg}• database-expert{/} - Schema design, query optimization
{yellow-fg}• test-writer{/} - Test suite development
{yellow-fg}• test-runner-fixer{/} - Test execution and debugging
{yellow-fg}• docs-sync-checker{/} - Documentation synchronization
{yellow-fg}• Custom Agents{/} - Create specialized agents for your needs

{bold}Creating and Launching Subagents:{/}
${highlightCode(`const result = await task({
  subagent_type: 'backend-expert',
  description: 'Implement REST API',
  prompt: 'Design and implement user authentication endpoints...'
});`)}

{bold}Use Cases:{/}
• Complex multi-step workflows
• Specialized expertise needed
• Parallel task execution
• Research and analysis tasks
• Code generation and refactoring

{bold}Benefits:{/}
• Autonomous task execution
• Specialized expertise for different domains
• Parallel processing capabilities
• Reduced need for manual intervention
`
  };
}

