# Advanced Features Examples

This directory contains examples demonstrating the advanced features of the Claude Code SDK.

## Examples

### 1. Token Streaming (`token-streaming.ts`)

Demonstrates token streaming patterns and workarounds:
- SDK token stream analysis (shows current chunked delivery behavior)
- Response collection pattern for processing complete responses
- **Character-by-character typewriter effect** (working visual streaming)
- Stream metrics and timing analysis

**Important**: Claude Code CLI currently delivers responses in chunks rather than true token-by-token streaming. Example 3 shows how to create actual visual streaming effects by controlling display timing after collection.

**Run:**
```bash
npx tsx token-streaming.ts
```

### 2. Error Handling (`error-handling.ts`)

Shows advanced error handling patterns:
- Typed error detection
- Retry logic for rate limits
- Graceful degradation
- Error logging strategies
- Custom error handlers

**Run:**
```bash
npx tsx error-handling.ts
```

### 3. Retry Strategies (`retry-strategies.ts`)

Explores various retry patterns:
- Exponential backoff
- Linear retry
- Fibonacci sequence retry
- Circuit breaker pattern
- Retry with telemetry

**Run:**
```bash
npx tsx retry-strategies.ts
```

### 4. Interactive Streaming Session (`interactive-streaming.ts`)

Interactive CLI chat with visual typewriter streaming:
- Real-time character-by-character display of responses
- Conversation history management
- Adjustable streaming speed (fast/normal/slow)
- Model switching and debug mode
- Session commands and help system

**Features the only working visual streaming pattern** - responses appear with realistic typewriter effect!

**Run:**
```bash
npx tsx interactive-streaming.ts
```

## Prerequisites

Make sure you have the SDK installed:

```bash
npm install @instantlyeasy/claude-code-sdk-ts
```

And Claude Code CLI configured:

```bash
claude --help
```

## Best Practices

These examples demonstrate production-ready patterns:

1. **Error Handling**: Always wrap your queries in try-catch blocks and handle specific error types appropriately.

2. **Retry Logic**: Use exponential backoff for transient failures and respect rate limits.

3. **Streaming**: Use token streaming for better UX in interactive applications.

4. **Telemetry**: Track metrics to understand your application's behavior and performance.

## Additional Resources

- [Main SDK Documentation](../../../README.md)
- [Fluent API Guide](../README.md)
- [API Reference](../../../docs/API.md)