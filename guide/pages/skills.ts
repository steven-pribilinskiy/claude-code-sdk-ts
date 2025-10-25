import type { CategoryData } from '../types.js';
import { highlightCode } from '../utils.js';

export function getSkillsPage(): CategoryData {
  return {
    title: 'Skills - Reusable Capability Shortcuts',
    content: `{bold}{cyan-fg}Skills Overview{/}

Skills are reusable capability shortcuts that can be invoked within Claude Code to extend functionality
and create specialized workflows for specific tasks.

{yellow-fg}Documentation:{/}
{green-fg}https://docs.claude.com/en/docs/claude-code/skills{/}

{bold}Available Skills:{/}
{yellow-fg}• Code Analysis{/} - Analyze code for patterns and issues
{yellow-fg}• Testing{/} - Generate and run tests
{yellow-fg}• Documentation{/} - Generate docs from code
{yellow-fg}• Refactoring{/} - Code improvements and modernization
{yellow-fg}• Performance{/} - Profiling and optimization
{yellow-fg}• Security{/} - Security analysis and hardening
{yellow-fg}• Custom Skills{/} - Create domain-specific skills

{bold}Using Skills in Your Workflow:{/}
${highlightCode(`const analysis = await skill({
  name: 'code-analysis',
  prompt: 'Analyze this TypeScript code for performance issues...',
  files: ['src/main.ts', 'src/utils.ts']
});`)}

{bold}Creating Custom Skills:{/}
Skills can be custom-built for your specific needs:
• Specialized analysis tools
• Domain-specific generators
• Integration helpers
• Team workflow automation

{bold}Benefits:{/}
• Faster task execution
• Consistent tool usage
• Easier knowledge sharing
• Team standardization
`
  };
}

