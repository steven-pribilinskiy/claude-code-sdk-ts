import type { CategoryData } from '../types.js';
import { TOOLS_COUNT } from '../constants.js';
import { highlightCode } from '../utils.js';

export function getGettingStartedPage(sdkVersion: string): CategoryData {
  return {
    title: 'Claude Code SDK - Getting Started',
    content: `{bold}{cyan-fg}Claude Code SDK for TypeScript v${sdkVersion}{/}

An unofficial TypeScript SDK for Claude Code CLI that provides:
• Fluent API with method chaining
• ${TOOLS_COUNT} available tools for file operations, web access, and more
• Multiple Claude models (Opus, Sonnet, Haiku)
• Flexible permission management
• Session management for conversation context
• MCP (Model Context Protocol) server integration
• Rich response parsing options

{bold}{yellow-fg}Available Sections:{/}{/bold}

{bold}{yellow-fg}SDK{/} - TypeScript SDK Wrapper
{green-fg}• Getting Started{/} - Introduction and overview
{green-fg}• Available Tools{/} - Browse the ${TOOLS_COUNT} tools available
{green-fg}• Models{/} - Learn about Claude models (Opus, Sonnet, Haiku)
{green-fg}• Permission Modes{/} - Understand permission handling
{green-fg}• Configuration Options{/} - All config parameters explained
{green-fg}• Response Parsers{/} - Different ways to parse responses
{green-fg}• Fluent API Methods{/} - Complete method reference
{green-fg}• Session Features{/} - Multi-turn conversations
{green-fg}• Examples{/} - Code examples and tutorials

{bold}{yellow-fg}CLAUDE CODE{/} - Extended Features
{green-fg}• MCP Servers{/} - Model Context Protocol integration
{green-fg}• Subagents{/} - Specialized task agents for workflows
{green-fg}• Skills{/} - Reusable capability shortcuts
{green-fg}• Plugins{/} - Extended integration capabilities

{yellow-fg}Use arrow keys or 'j'/'k' to navigate, 'Enter' to select, 'q' to quit{/}

{bold}Quick Start:{/}
${highlightCode(`import { claude } from '@instantlyeasy/claude-code-sdk-ts';

const result = await claude()
  .withModel('sonnet')
  .allowTools('Read', 'Write')
  .query('Create a README file')
  .asText();`)}
`
  };
}

