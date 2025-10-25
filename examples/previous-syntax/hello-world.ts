/**
 * Hello World Example
 * Demonstrates the simplest usage of the Claude Code SDK
 *
 * @traits streaming
 */

import { query } from '../../dist/index.js';

async function main() {
  console.log('Asking Claude to say Hello World...\n');
  
  for await (const message of query('Say "Hello World!"')) {
    if (message.type === 'assistant') {
      for (const block of message.content) {
        if (block.type === 'text') {
          console.log('Claude says:', block.text);
        }
      }
    }
  }
}

main().catch(console.error);