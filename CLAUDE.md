# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **unofficial TypeScript SDK** for Claude Code - a TypeScript port of the official Python SDK. It provides both a fluent API and a classic async generator API for interacting with the Claude Code CLI.

**Key Architecture:**
- **Fluent API** (`src/fluent.ts`): Modern chainable interface via `claude()` function
- **Classic API** (`src/index.ts`): Original async generator via `query()` function
- **Transport Layer** (`src/_internal/transport/`): Subprocess management for Claude CLI
- **Parser** (`src/parser.ts`): Response parsing and transformation utilities
- **Enhanced Features** (`src/enhanced/`): Token streaming, retry strategies, error handling

## Essential Commands

### Development
```bash
# Build the library
npm run build

# Watch mode for development
npm run dev

# Type checking without emit
npm run typecheck
```

### Testing
```bash
# Run tests with Vitest
npm test

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Lint TypeScript files
npm run lint

# Format code with Prettier
npm run format
```

### Examples
```bash
# Run the examples index (interactive menu)
npm run examples

# Run SDK browser (terminal UI for exploring the SDK)
npm run browser
```

## Architecture Overview

### Core Message Flow
1. **User Query** → `QueryBuilder` (fluent.ts) or `query()` (index.ts)
2. **InternalClient** (_internal/client.ts) processes options and environment
3. **SubprocessCLITransport** spawns `claude` CLI subprocess
4. **Message Streaming** via async generators yields `Message` types
5. **ResponseParser** transforms messages into convenient formats

### Type System Structure
- **Base types** (`src/types.ts`): Core message types, tool definitions, options
- **Specialized types** (`src/types/`): Streaming, retry, roles, permissions, telemetry
- **CLI types**: `CLIOutput` → parsed into `Message` (assistant, system, result)

### Key Components

**QueryBuilder** (`src/fluent.ts`)
- Chainable API for building queries
- Manages permissions, tools, model selection
- Integrates config files and role system
- Returns `ResponseParser` for response handling

**ResponseParser** (`src/parser.ts`)
- Convenience methods: `asText()`, `asJSON()`, `asResult()`, `asToolExecutions()`
- Token usage tracking: `getUsage()` returns cost and token counts
- Session management: `getSessionId()` for conversation continuity
- Streaming support: `stream(callback)` for real-time processing

**InternalClient** (`src/_internal/client.ts`)
- Bridges SDK to Claude CLI subprocess
- Parses CLI JSON output into typed messages
- Handles environment option merging
- Manages message lifecycle

**SubprocessCLITransport** (`src/_internal/transport/subprocess-cli.ts`)
- Spawns and manages `claude` CLI process
- Builds CLI arguments from `ClaudeCodeOptions`
- Handles JSONL streaming from stdout/stderr
- Implements abort signal handling

### Enhanced Features

**Token Streaming** (`src/streaming/token-stream.ts`)
- `createTokenStream()` for character-by-character display
- Works with message generators for typewriter effects
- Used in interactive streaming examples

**Retry Strategies** (`src/retry/executor.ts`)
- Exponential, linear, and Fibonacci backoff strategies
- `withRetry()` helper for automatic retry logic
- Configurable retry conditions and max attempts

**Error Handling** (`src/errors/enhanced.ts`)
- `detectErrorType()` classifies errors automatically
- Typed error classes with specific properties
- `isEnhancedError()` and `hasResolution()` type guards

**Roles System** (`src/roles/manager.ts`)
- Load reusable configurations from YAML/JSON
- Template variable substitution in prompts
- Role inheritance via `extends` field
- Integrated with fluent API via `withRole()`

**Permissions** (`src/permissions/`)
- Tool-level permissions (allow/deny lists)
- Per-call permission overrides
- Permission mode management (bypass, acceptEdits, default)

**Config Loader** (`src/config/loader.ts`)
- Loads YAML/JSON configuration files
- Supports roles, global settings, MCP servers
- Validates configuration schema

## Development Patterns

### Adding New Features
1. Add types to `src/types.ts` or create new type file in `src/types/`
2. Implement functionality in appropriate module
3. Export from `src/index.ts` for public API
4. Add examples to `examples/` directory (use `.ts` extension)
5. Document in `docs/` directory if complex

### Testing
- Tests use Vitest (`vitest.config.ts`)
- Test files should be `*.test.ts` or `*.spec.ts`
- Coverage reports via `@vitest/coverage-v8`

### Building
- Build with `tsup` (`tsup.config.ts`)
- Outputs to `dist/` with `.js`, `.cjs`, and `.d.ts` files
- Both ESM and CJS formats supported
- Source maps and declaration maps generated

### Code Style
- TypeScript strict mode enabled
- ESLint for linting (`@typescript-eslint`)
- Prettier for formatting
- Use type annotations and avoid `any`

## Important Notes

### Authentication
The SDK **delegates all authentication to the Claude CLI**. Users must run `claude login` before using the SDK. The SDK never handles API keys directly.

### Environment Variables
The SDK loads safe configuration from environment variables but **intentionally does not** load `ANTHROPIC_API_KEY` for safety (prevents accidental billing). Supported variables:
- `DEBUG`, `VERBOSE`, `LOG_LEVEL` - Logging configuration
- `NODE_ENV` - Environment detection

### Message Streaming Behavior
The SDK streams **complete messages**, not individual tokens. Each `assistant` message contains full text blocks, not incremental token updates. For character-by-character display, use `createTokenStream()` from enhanced features.

### Tool Names
Valid tool names: `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `LS`, `MultiEdit`, `NotebookRead`, `NotebookEdit`, `WebFetch`, `TodoRead`, `TodoWrite`, `WebSearch`, `Task`, `MCPTool`

### Session Management
Sessions maintain conversation context. Use `getSessionId()` after first query, then pass to `withSessionId()` in subsequent queries to continue the conversation.

## Examples Structure

Examples have been converted from `.js` to `.ts`:
- **`examples/fluent-api/`** - Basic fluent API examples
- **`examples/fluent-api/new-features/`** - Enhanced features (streaming, retry, error handling)
- **`examples/previous-syntax/`** - Classic async generator API examples
- **`examples/config/`** - Configuration file examples (YAML/JSON)

All examples use TypeScript and can be run via `tsx` (already installed).

### Example Traits System

Examples can be tagged with traits to indicate special requirements or features. Add `@traits` line to the JSDoc comment:

**Trait Vocabulary:**
- `interactive` - Uses readline/stdin for user interaction (requires terminal input)
- `requires-args` - Needs command-line arguments via process.argv
- `streaming` - Uses `.stream()` or `createTokenStream()` for response streaming
- `config` - Uses `withConfigFile()` or `withRolesFile()` for configuration files

**Usage in Comments:**
```typescript
/**
 * Example Name
 * Description here
 *
 * @traits interactive, streaming
 */
```

Multiple traits can be combined (comma-separated). Examples in the browser menu will display icons indicating their traits.

## CLI Integration

The SDK executes the `claude` CLI and requires it to be installed:
```bash
npm install -g @anthropic-ai/claude-code
```

The subprocess transport builds CLI arguments from `ClaudeCodeOptions`:
- `--model` for model selection
- `--allow-tool` / `--deny-tool` for permissions
- `--permission-mode` for permission handling
- `--timeout` for operation timeouts
- `--add-dir` for additional directories
- `--mcp-server` for MCP server configs
- `--session-id` for session continuity

## Publishing

This package is published to npm as `@instantlyeasy/claude-code-sdk-ts`. The `prepare` script runs build automatically before publishing.
