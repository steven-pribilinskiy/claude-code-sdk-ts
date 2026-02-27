# Persistent Client Implementation Limitation

## Discovery

After implementing the persistent client pattern inspired by claude-code-viewer, we discovered a **fundamental limitation** with the Claude CLI's `--print` flag:

### The Problem

**The `--print` flag reads ALL of stdin until EOF before processing.**

This means:
- ❌ We cannot keep stdin open and feed messages incrementally
- ❌ The CLI won't process a message until stdin is closed
- ❌ Once stdin is closed, we cannot send more messages to the same process

### Test Evidence

```bash
# This sends both messages, then closes stdin
# The CLI processes BOTH at once in a single turn
(echo "Say hello"; sleep 2; echo "Say goodbye") | claude --print --output-format stream-json --model haiku

# Output: Single response containing both "Hello" and "Goodbye"
```

The CLI waits for stdin EOF before starting, then processes all input as a single conversation turn.

### Why claude-code-viewer Works

Looking back at claude-code-viewer, they likely:
1. Use the Claude API directly (not the CLI)
2. Or use interactive mode (not `--print`)
3. Or spawn new processes with `--resume`

Our assumption that we could keep a CLI process alive with `--print` was incorrect.

### Alternative Approaches

#### Approach 1: Session-Based Client (RECOMMENDED)

Spawn a new process for each query, but use `--resume` with the same session ID:

```typescript
class SessionClient {
  private sessionId?: string;

  async query(prompt: string) {
    const args = ['--print', '--output-format', 'stream-json'];
    
    if (this.sessionId) {
      args.push('--resume', this.sessionId);  // Reuse session!
    }
    
    const process = spawn('claude', args);
    process.stdin.write(prompt);
    process.stdin.end();  // Must close!
    
    // ... collect output ...
    // Capture session ID from first query
    if (!this.sessionId) {
      this.sessionId = capturedSessionId;
    }
  }
}
```

**Benefits:**
- ✅ Session continuity (conversation history preserved)
- ✅ **Server-side cache still works!** (5-minute window)
- ✅ Simple, reliable
- ❌ New process per query (overhead)
- ❌ No persistent process

#### Approach 2: Interactive Mode Client

Use interactive mode without `--print`:

```typescript
// Spawn once
const process = spawn('claude', ['--output-format', 'stream-json']);

// Keep sending to stdin
process.stdin.write('Say hello\n');
// ... wait for response ...
process.stdin.write('Say goodbye\n');
```

**Problem:** Interactive mode might not work well programmatically, and output parsing is complex.

#### Approach 3: Direct API Client

Use the Anthropic API directly instead of the CLI:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
// Use proper prompt caching headers
```

**Problem:** Requires API key management, loses CLI features (MCP, tools, etc.)

### Recommendation

**Use Approach 1: Session-Based Client**

This gives us:
- Session continuity via `--resume`
- Server-side cache benefits (the 5-minute cache is session-bound, not process-bound!)
- Simple, reliable implementation
- All CLI features (MCP, tools, permissions, etc.)

The only downside is process spawn overhead, but that's acceptable for most use cases.

### Updated Understanding of Cache

**Important Discovery:** After testing, the 5-minute ephemeral cache is **process-bound**, NOT session-bound!

From our testing:
```bash
# Query 1: Create session
echo "List files" | claude --print --model haiku
# session_id: abc123, cache_creation_input_tokens: 26000

# Query 2: Resume session (NEW PROCESS)
echo "Read package.json" | claude --print --resume abc123 --model haiku  
# cache_read_input_tokens: 0 ← NO CACHE HIT!
# cache_creation_input_tokens: 26000 ← Cache created again
```

**This confirms:**
- ❌ Cache is NOT preserved across processes
- ❌ `--resume` maintains conversation history but NOT cache
- ❌ The ephemeral cache only lives within a single CLI process
- ✅ We DO get session continuity (conversation history)

### Implementation Decision

Given these discoveries:

**The ephemeral cache benefit cannot be achieved with the Claude CLI in `--print` mode.**

Reasons:
1. `--print` requires stdin EOF, can't keep process alive
2. Spawning new processes loses the ephemeral cache
3. `--resume` maintains history but not cache

### What We CAN Do

**Option 1: Session Continuity Client** (RECOMMENDED)
- Spawn new process per query with `--resume`
- ✅ Maintains conversation history
- ✅ Simple, reliable
- ✅ All CLI features work
- ❌ No cache benefits
- ❌ Process spawn overhead

**Option 2: Keep Current Implementation**
- Accept that it's primarily educational
- Shows how the pattern WOULD work if CLI supported it
- Documents the limitation clearly
- Maybe useful if CLI behavior changes in future

### Recommendation

Given that **cache benefits are not achievable**, the current SDK implementation (spawn per query) is actually optimal for CLI usage. The "Persistent Client" we built demonstrates an interesting pattern but doesn't provide the performance benefits we hoped for.

**We should:**
1. Keep the implementation as educational code
2. Add clear documentation about the limitation
3. Update examples to show session continuity (not cache benefits)
4. Consider removing or marking as experimental

### Alternative: Direct API Client

For true cache benefits, users would need to use the Anthropic API directly with proper prompt caching headers, bypassing the CLI entirely. This would require:
- API key management
- Implementing tool handling
- Implementing MCP integration
- Much more complexity

---

**Final Conclusion:** 

The persistent client pattern we implemented is **technically interesting but practically limited**. The Claude CLI's `--print` mode fundamentally doesn't support keeping a process alive for multiple queries, and the ephemeral cache is process-bound.

The standard SDK approach (spawn per query) is actually the correct implementation for CLI usage. Users wanting cache benefits should use the Anthropic API directly, not the CLI.

