import type { CategoryData } from '../types.js';
import { PERMISSION_MODES } from '../constants.js';
import { highlightCode } from '../utils.js';

export function getPermissionModesPage(): CategoryData {
  const content = `{bold}{cyan-fg}Permission Modes{/}

{yellow-fg}1. ${PERMISSION_MODES[0]}{/}
   • Claude asks for permission for each tool use
   • Safest mode for production
   • User approves/denies each operation
   • Use: .withPermissions('default')

{yellow-fg}2. ${PERMISSION_MODES[1]}{/}
   • Auto-accept file edit operations
   • Still asks for other operations (Bash, etc.)
   • Good balance of safety and convenience
   • Use: .acceptEdits()

{yellow-fg}3. ${PERMISSION_MODES[2]}{/}
   • Skip all permission prompts
   • Fastest execution
   • Use with caution!
   • Use: .skipPermissions()

{bold}Tool-Level Control:{/}
${highlightCode(`// Allow only specific tools
await claude()
  .allowTools('Read', 'Grep')
  .query('Search files')
  .asText();

// Deny dangerous tools
await claude()
  .denyTools('Bash', 'Write')
  .query('Analyze code')
  .asText();

// Read-only mode (no tools)
await claude()
  .allowTools()
  .query('Explain concept')
  .asText();`)}`;

  return {
    title: 'Permission Management',
    content
  };
}

