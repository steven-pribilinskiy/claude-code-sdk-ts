import type { CategoryData } from '../types.js';
import { TOOLS_COUNT } from '../constants.js';

export function getSdkPage(sdkVersion: string): CategoryData {
  return {
    title: 'Claude Code SDK - TypeScript Wrapper',
    content: `{bold}{cyan-fg}SDK - TypeScript SDK for Claude Code{/}

This is an unofficial TypeScript/JavaScript SDK that wraps the Claude Code CLI and provides:

{bold}Core Features:{/}
{green-fg}• Fluent API{/} - Chainable method interface for building queries
{green-fg}• Classic API{/} - Async generator for direct CLI interaction
{green-fg}• ${TOOLS_COUNT} Tools{/} - File operations, web access, code analysis
{green-fg}• Model Selection{/} - Choose between Haiku, Sonnet, Opus models
{green-fg}• Permission Management{/} - Control which tools can be used
{green-fg}• Session Management{/} - Maintain conversation context
{green-fg}• Response Parsing{/} - Multiple formats (text, JSON, streaming)

{bold}Included Sections:{/}
{green-fg}• Getting Started{/} - Introduction and overview
{green-fg}• Available Tools{/} - Browse ${TOOLS_COUNT} available tools
{green-fg}• Models{/} - Compare and select models
{green-fg}• Permission Modes{/} - Permission handling strategies
{green-fg}• Configuration Options{/} - SDK configuration parameters
{green-fg}• Response Parsers{/} - Response parsing methods
{green-fg}• Fluent API Methods{/} - Complete API reference
{green-fg}• Session Features{/} - Multi-turn conversations
{green-fg}• Examples{/} - Code examples and patterns

{bold}Quick Links:{/}
{cyan-fg}GitHub:{/} https://github.com/instantlyeasy/claude-code-sdk-ts
{cyan-fg}NPM:{/} @instantlyeasy/claude-code-sdk-ts
{cyan-fg}Version:{/} v${sdkVersion}
`
  };
}

