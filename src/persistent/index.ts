/**
 * Persistent Client API
 * 
 * This module provides a persistent Claude CLI client that keeps a single
 * process alive across multiple queries, enabling the 5-minute ephemeral
 * cache to work and significantly improve performance.
 * 
 * Pattern inspired by claude-code-viewer:
 * https://github.com/d-kimuson/claude-code-viewer
 * 
 * @example
 * ```typescript
 * import { PersistentClient } from '@anthropic-ai/claude-code-sdk/persistent';
 * 
 * const client = new PersistentClient({ cwd: process.cwd() });
 * await client.start();
 * 
 * // First query (cache miss)
 * const result1 = await client.query("List files");
 * 
 * // Second query to SAME process (cache hit!)
 * const result2 = await client.query("Read package.json");
 * 
 * await client.stop();
 * ```
 */

export { PersistentClient } from './persistent-client.js';
export type { PersistentSessionState, PersistentQueryResult } from './persistent-client.js';

export { PersistentCLITransport } from './persistent-cli-transport.js';
export type { ProcessState, PersistentTransportEvent } from './persistent-cli-transport.js';

export { createMessageGenerator } from './message-generator.js';
export type { MessageGenerator, MessageGeneratorHooks } from './message-generator.js';

export { controllablePromise } from './controllable-promise.js';
export type { ControllablePromise } from './controllable-promise.js';

