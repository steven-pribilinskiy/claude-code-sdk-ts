import type { UserMessage } from '../types.js';
import { controllablePromise, type ControllablePromise } from './controllable-promise.js';

/**
 * Hooks that can be attached to the message generator lifecycle
 */
export interface MessageGeneratorHooks {
  /**
   * Called when a new user message is about to be yielded
   */
  onNewUserMessageResolved?: (message: string) => void | Promise<void>;
  
  /**
   * Called when the generator encounters an error
   */
  onError?: (error: Error) => void | Promise<void>;
}

/**
 * Message generator interface for persistent Claude processes
 */
export interface MessageGenerator {
  /**
   * The async generator that yields user messages
   */
  generateMessages: () => AsyncGenerator<UserMessage, void, unknown>;
  
  /**
   * Set the next message to be sent to Claude
   * This unblocks the generator and allows it to yield the message
   */
  setNextMessage: (message: string) => void;
  
  /**
   * Attach lifecycle hooks to the generator
   */
  setHooks: (hooks: MessageGeneratorHooks) => void;
  
  /**
   * Terminate the generator
   */
  terminate: () => void;
}

/**
 * Creates a message generator that can be controlled externally.
 * This is the core mechanism for keeping a Claude CLI process alive
 * and feeding it new prompts dynamically.
 * 
 * Pattern inspired by claude-code-viewer's implementation:
 * https://github.com/d-kimuson/claude-code-viewer
 * 
 * @example
 * ```typescript
 * const { generateMessages, setNextMessage } = createMessageGenerator();
 * 
 * // Start the Claude process with the generator
 * const client = new PersistentClient(options);
 * const process = await client.startProcess(generateMessages);
 * 
 * // Send first message
 * setNextMessage("Hello, Claude!");
 * 
 * // Process handles the message...
 * 
 * // Send another message to the SAME process
 * setNextMessage("Tell me a joke");
 * ```
 */
export function createMessageGenerator(): MessageGenerator {
  let sendMessagePromise: ControllablePromise<string> = controllablePromise<string>();
  let hooks: MessageGeneratorHooks = {};
  let isTerminated = false;

  /**
   * The async generator function that runs in an infinite loop,
   * waiting for new messages to be set via setNextMessage()
   */
  async function* generateMessages(): AsyncGenerator<UserMessage, void, unknown> {
    // Reset promise for first iteration
    sendMessagePromise = controllablePromise<string>();
    
    while (true) {
      // Block here until setNextMessage() is called
      try {
        const message = await sendMessagePromise.promise;
        
        // Check if terminated
        if (isTerminated) {
          break;
        }
        
        // Call hook before yielding
        if (hooks.onNewUserMessageResolved) {
          await hooks.onNewUserMessageResolved(message);
        }
        
        // Prepare for next message
        sendMessagePromise = controllablePromise<string>();
        
        // Yield the user message to Claude
        yield {
          type: 'user',
          content: message,
        } as UserMessage;
        
      } catch (error) {
        if (hooks.onError) {
          await hooks.onError(error as Error);
        }
        
        // If terminated, break the loop
        if (isTerminated) {
          break;
        }
        
        // Otherwise, reset and continue
        sendMessagePromise = controllablePromise<string>();
      }
    }
  }

  /**
   * Set the next message to be sent to Claude.
   * This resolves the pending promise and unblocks the generator.
   */
  const setNextMessage = (message: string): void => {
    if (isTerminated) {
      console.warn('[MessageGenerator] Cannot set message: generator is terminated');
      return;
    }
    
    if (sendMessagePromise.status !== 'pending') {
      console.warn('[MessageGenerator] Previous message not consumed yet');
      // Create a new promise anyway to handle this case
      sendMessagePromise = controllablePromise<string>();
    }
    
    sendMessagePromise.resolve(message);
  };

  /**
   * Attach hooks to the generator lifecycle
   */
  const setHooks = (newHooks: MessageGeneratorHooks): void => {
    hooks = { ...hooks, ...newHooks };
  };

  /**
   * Terminate the generator, causing it to exit the infinite loop
   */
  const terminate = (): void => {
    isTerminated = true;
    if (sendMessagePromise.status === 'pending') {
      sendMessagePromise.reject(new Error('Generator terminated'));
    }
  };

  return {
    generateMessages,
    setNextMessage,
    setHooks,
    terminate,
  };
}

