/**
 * Persistent Client Demo
 * 
 * This example demonstrates how to use the PersistentClient to keep a Claude CLI
 * process alive across multiple queries, enabling the 5-minute ephemeral cache
 * to work and significantly improve performance.
 * 
 * Pattern inspired by claude-code-viewer:
 * https://github.com/d-kimuson/claude-code-viewer
 */

import { PersistentClient } from '../src/persistent/persistent-client.js';

async function main() {
  console.log('='.repeat(80));
  console.log('PERSISTENT CLIENT DEMO - Cache Benefits');
  console.log('='.repeat(80));
  console.log();

  const client = new PersistentClient({
    cwd: process.cwd(),
    model: 'haiku',  // Use Haiku for faster, cheaper testing
    // permissionMode: 'bypassPermissions',  // Auto-accept for demo
  });

  try {
    // ============================================================================
    // Step 1: Start the persistent process
    // ============================================================================
    console.log('📦 Starting persistent Claude CLI process...');
    console.log('This will spawn a single process that stays alive.\n');
    
    // Start with an initial "hello" to initialize the session
    await client.start("Say 'ready' when you're initialized");
    
    const initialState = client.getState();
    console.log('✅ Process started!');
    console.log('   Session ID:', initialState.sessionId);
    console.log('   Process State:', initialState.processState);
    console.log('   Is Alive:', initialState.isAlive);
    console.log();

    // ============================================================================
    // Step 2: First query - This will be a CACHE MISS
    // ============================================================================
    console.log('─'.repeat(80));
    console.log('Query #1: Listing project files (CACHE MISS expected)');
    console.log('─'.repeat(80));
    console.log('⏱️  Starting query at:', new Date().toISOString());
    
    const start1 = Date.now();
    const result1 = await client.query(
      'Please list all TypeScript files in the src/ directory. Just provide a simple list.'
    );
    const duration1 = Date.now() - start1;
    
    console.log('✅ Query completed in', duration1, 'ms');
    console.log('   Messages received:', result1.messages.length);
    console.log('   Session State:', result1.sessionState.processState);
    console.log('   Total queries:', result1.sessionState.messageCount);
    
    // Show some output
    for (const msg of result1.messages) {
      if (msg.type === 'assistant') {
        console.log('\n📝 Assistant response:');
        if (typeof msg.content === 'string') {
          console.log(msg.content.substring(0, 500));
        } else if (Array.isArray(msg.content)) {
          for (const block of msg.content) {
            if ('text' in block) {
              console.log(block.text.substring(0, 500));
            }
          }
        }
        break;
      }
    }
    console.log();

    // ============================================================================
    // Step 3: Second query - This should be a CACHE HIT!
    // ============================================================================
    console.log('─'.repeat(80));
    console.log('Query #2: Reading a specific file (CACHE HIT expected)');
    console.log('─'.repeat(80));
    console.log('⚡ IMPORTANT: This query uses the SAME process!');
    console.log('   The 5-minute ephemeral cache should speed this up significantly.');
    console.log();
    console.log('⏱️  Starting query at:', new Date().toISOString());
    
    const start2 = Date.now();
    const result2 = await client.query(
      'What is in the package.json file? Please show the main dependencies.'
    );
    const duration2 = Date.now() - start2;
    
    console.log('✅ Query completed in', duration2, 'ms');
    console.log('   Messages received:', result2.messages.length);
    console.log('   Session State:', result2.sessionState.processState);
    console.log('   Total queries:', result2.sessionState.messageCount);
    
    // Show some output
    for (const msg of result2.messages) {
      if (msg.type === 'assistant') {
        console.log('\n📝 Assistant response:');
        if (typeof msg.content === 'string') {
          console.log(msg.content.substring(0, 500));
        } else if (Array.isArray(msg.content)) {
          for (const block of msg.content) {
            if ('text' in block) {
              console.log(block.text.substring(0, 500));
            }
          }
        }
        break;
      }
    }
    console.log();

    // ============================================================================
    // Step 4: Performance comparison
    // ============================================================================
    console.log('─'.repeat(80));
    console.log('PERFORMANCE COMPARISON');
    console.log('─'.repeat(80));
    console.log(`Query #1 (cache miss): ${duration1}ms`);
    console.log(`Query #2 (cache hit):  ${duration2}ms`);
    
    if (duration2 < duration1) {
      const improvement = ((duration1 - duration2) / duration1 * 100).toFixed(1);
      console.log(`\n🚀 Query #2 was ${improvement}% faster!`);
      console.log('   This is the benefit of the ephemeral cache!');
    }
    console.log();

    // ============================================================================
    // Step 5: Third query to demonstrate continued cache benefits
    // ============================================================================
    console.log('─'.repeat(80));
    console.log('Query #3: Another query (continued cache benefits)');
    console.log('─'.repeat(80));
    console.log('⏱️  Starting query at:', new Date().toISOString());
    
    const start3 = Date.now();
    const result3 = await client.query(
      'Count how many example files are in the examples/ directory.'
    );
    const duration3 = Date.now() - start3;
    
    console.log('✅ Query completed in', duration3, 'ms');
    console.log('   Messages received:', result3.messages.length);
    console.log('   Total queries:', result3.sessionState.messageCount);
    console.log();

    // ============================================================================
    // Final state
    // ============================================================================
    console.log('─'.repeat(80));
    console.log('FINAL SESSION STATE');
    console.log('─'.repeat(80));
    const finalState = client.getState();
    console.log('Session ID:', finalState.sessionId);
    console.log('Process State:', finalState.processState);
    console.log('Is Alive:', finalState.isAlive);
    console.log('Total Queries:', finalState.messageCount);
    console.log();

    console.log('💡 KEY INSIGHT:');
    console.log('   All 3 queries used the SAME Claude CLI process!');
    console.log('   The process stayed alive between queries, allowing the');
    console.log('   5-minute ephemeral cache to work across queries.');
    console.log();

    // ============================================================================
    // Cleanup
    // ============================================================================
    console.log('🧹 Stopping the persistent process...');
    await client.stop();
    console.log('✅ Process stopped cleanly.');
    console.log();

    console.log('='.repeat(80));
    console.log('COMPARISON: Standard Client vs Persistent Client');
    console.log('='.repeat(80));
    console.log();
    console.log('STANDARD CLIENT (current SDK behavior):');
    console.log('  Query #1: Spawn process → Execute → Kill process');
    console.log('  Query #2: Spawn NEW process → Execute → Kill process');
    console.log('  Query #3: Spawn NEW process → Execute → Kill process');
    console.log('  ❌ Cache is lost between queries');
    console.log('  ❌ Each query starts fresh');
    console.log();
    console.log('PERSISTENT CLIENT (this implementation):');
    console.log('  Startup:  Spawn process');
    console.log('  Query #1: Execute (cache miss)');
    console.log('  Query #2: Execute (cache hit!) ← SAME PROCESS');
    console.log('  Query #3: Execute (cache hit!) ← SAME PROCESS');
    console.log('  Cleanup:  Kill process');
    console.log('  ✅ Cache is preserved for 5 minutes');
    console.log('  ✅ Significant performance improvement');
    console.log();

  } catch (error) {
    console.error('❌ Error:', error);
    
    // Clean up on error
    try {
      await client.stop();
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
    
    process.exit(1);
  }
}

// Run the demo
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

