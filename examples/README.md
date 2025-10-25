# Claude Code SDK Examples

This directory contains practical examples demonstrating various use cases for the Claude Code SDK TypeScript implementation.

## 📁 Directory Structure

- **`fluent-api/`** - Modern examples using the fluent API with method chaining
- **`previous-syntax/`** - Examples using the traditional function-based API

## 🎯 Choose Your API Style

### Fluent API (Recommended)
The fluent API provides a more intuitive, chainable interface:
```javascript
const result = await claude()
  .withModel('opus')
  .allowTools('Read', 'Write')
  .acceptEdits()
  .query('Create a README file')
  .asText();
```

### Previous Syntax
The traditional function-based approach:
```javascript
for await (const message of query('Create a README file', {
  model: 'opus',
  allowedTools: ['Read', 'Write'],
  permissionMode: 'acceptEdits'
})) {
  // Handle messages
}
```

## 📚 Examples Overview

### Core Examples (Available in Both API Styles)

1. **Hello World** - The simplest example
   - Fluent: `npx tsx fluent-api/hello-world.ts`
   - Previous: `npx tsx previous-syntax/hello-world.ts`

2. **File Operations** - File creation, reading, and editing
   - Fluent: `npx tsx fluent-api/file-operations.ts`
   - Previous: `npx tsx previous-syntax/file-operations.ts`

3. **Code Analysis** - Analyze code patterns and quality
   - Fluent: `npx tsx fluent-api/code-analysis.ts`
   - Previous: `npx tsx previous-syntax/code-analysis.ts`

4. **Interactive Session** - Interactive CLI with Claude
   - Fluent: `npx tsx fluent-api/interactive-session.ts`
   - Previous: `npx tsx previous-syntax/interactive-session.ts`

5. **Web Research** - Research and learning tasks
   - Fluent: `npx tsx fluent-api/web-research.ts`
   - Previous: `npx tsx previous-syntax/web-research.ts`

6. **Project Scaffolding** - Create project structures
   - Fluent: `npx tsx fluent-api/project-scaffolding.ts react-app my-project`
   - Previous: `npx tsx previous-syntax/project-scaffolding.ts`

7. **Error Handling** - Comprehensive error patterns
   - Fluent: `npx tsx fluent-api/error-handling.ts`
   - Previous: `npx tsx previous-syntax/error-handling.ts`

### Fluent API Exclusive Examples

8. **[fluent-api-demo.ts](./fluent-api-demo.ts)** - Comprehensive fluent API showcase
9. **[response-parsing-demo.ts](./response-parsing-demo.ts)** - Advanced response handling
10. **[new-features-demo.ts](./new-features-demo.ts)** - MCP permissions, roles, and config files
11. **[enhanced-features-demo.ts](./enhanced-features-demo.ts)** - New enhanced features (v0.3.0)
12. **[production-features.ts](./production-features.ts)** - Production-ready features (AbortSignal, read-only mode, logging)
13. **[sessions.ts](./sessions.ts)** - Session management and conversation context

## 🚀 Getting Started

1. **Install the SDK:**
   ```bash
   npm install @instantlyeasy/claude-code-sdk-ts
   ```

2. **Install Claude CLI:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

3. **Authenticate:**
   ```bash
   claude login
   ```

4. **Run examples:**
   
   **Important:** Examples need the built distribution files. You have two options:
   
   **Option A - One-time build:**
   ```bash
   npm run build
   npm run examples:hello  # or any other example
   ```
   
   **Option B - Watch mode (recommended for development):**
   ```bash
   # Terminal 1: Auto-rebuild on changes
   npm run dev
   
   # Terminal 2: Run examples
   npm run examples  # Interactive menu
   ```
   
   **Available scripts:**
   - `npm run examples` - Interactive menu of all examples
   - `npm run guide` - SDK interactive guide

## 💡 Key Concepts

### Permission Modes
- `default` - Claude will ask for permission for each tool use
- `acceptEdits` - Auto-accept file edits but confirm other operations  
- `bypassPermissions` - Skip all permission prompts (use with caution)

### Tool Management
- `allowedTools` - Whitelist specific tools Claude can use
- `deniedTools` - Blacklist specific tools Claude cannot use

### Message Types
- `system` - Initialization and system messages
- `assistant` - Claude's responses and tool usage
- `user` - Tool results (from Claude's perspective)
- `result` - Final result with usage stats and cost

## 📝 Common Patterns

### Basic Query
```javascript
for await (const message of query('Your prompt here')) {
  if (message.type === 'result') {
    console.log(message.content);
  }
}
```

### With Options
```javascript
const options = {
  permissionMode: 'bypassPermissions',
  allowedTools: ['Read', 'Write']
};

for await (const message of query('Your prompt', options)) {
  // Handle messages
}
```

### Full Message Handling
```javascript
for await (const message of query('Your prompt')) {
  switch (message.type) {
    case 'system':
      // Handle system messages
      break;
    case 'assistant':
      // Handle Claude's responses
      break;
    case 'result':
      // Handle final result
      break;
  }
}
```

## 🛠️ Advanced Usage

See [error-handling.ts](./fluent-api/error-handling.ts) for:
- Retry logic implementation
- Graceful error handling
- Timeout management
- Authentication error handling

See [interactive-session.ts](./fluent-api/interactive-session.ts) for:
- Building interactive CLIs
- Dynamic option configuration
- User input handling

## 🆕 Enhanced Features (v0.3.0)

The SDK now includes several enhanced features based on early adopter feedback:

### 1. **Typed Error Handling**
```javascript
import { isRateLimitError, isToolPermissionError } from '@instantlyeasy/claude-code-sdk-ts';

try {
  // Your Claude query
} catch (error) {
  if (isRateLimitError(error)) {
    console.log(`Retry after ${error.retryAfter} seconds`);
  } else if (isToolPermissionError(error)) {
    console.log(`Tool ${error.tool} denied: ${error.reason}`);
  }
}
```

### 2. **Token-Level Streaming**
```javascript
import { createTokenStream } from '@instantlyeasy/claude-code-sdk-ts';

const tokenStream = createTokenStream(messageGenerator);
for await (const chunk of tokenStream.tokens()) {
  process.stdout.write(chunk.token);
}
```

### 3. **Per-Call Tool Permissions**
```javascript
const permissionManager = createPermissionManager(options);
const isAllowed = await permissionManager.isToolAllowed('Bash', context, {
  allow: ['Read', 'Write'],
  deny: ['Bash'],
  dynamicPermissions: {
    Write: async (ctx) => ctx.role === 'admin' ? 'allow' : 'deny'
  }
});
```

### 4. **OpenTelemetry Integration**
```javascript
const telemetryProvider = createTelemetryProvider();
const logger = telemetryProvider.getLogger('my-app');
const span = logger.startSpan('claude-query');
// ... your query
span.end();
```

### 5. **Exponential Backoff & Retry**
```javascript
const retryExecutor = createRetryExecutor({
  maxAttempts: 3,
  initialDelay: 1000,
  multiplier: 2
});

const result = await retryExecutor.execute(async () => {
  return await query('Your prompt');
});
```

See [enhanced-features-demo.ts](./enhanced-features-demo.ts) for a complete demonstration.

### 6. **Production Features**

See [production-features.ts](./production-features.ts) for:
- Cancellable queries with AbortSignal
- Read-only mode enforcement with `allowTools()`
- Advanced logging with nested object support
- Message vs token streaming clarification

### 7. **Session Management**

See [sessions.ts](./sessions.ts) for:
- Session management with `getSessionId()` and `withSessionId()`
- Maintaining conversation context across multiple queries

## 📖 Additional Resources

- [Claude Code CLI Documentation](https://github.com/anthropics/claude-code)
- [SDK TypeScript Types](../src/types.ts)
- [Main README](../README.md)