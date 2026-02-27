/**
 * A Promise that can be resolved or rejected externally.
 * Used to control async flow in the message generator pattern.
 */
export interface ControllablePromise<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  status: 'pending' | 'resolved' | 'rejected';
}

/**
 * Creates a promise that can be controlled externally.
 * This is the key mechanism for implementing the persistent process pattern.
 * 
 * @example
 * ```typescript
 * const controlledPromise = controllablePromise<string>();
 * 
 * // Later, from another part of your code:
 * controlledPromise.resolve("Hello!");
 * 
 * // The promise will now resolve:
 * const result = await controlledPromise.promise; // "Hello!"
 * ```
 */
export function controllablePromise<T>(): ControllablePromise<T> {
  let resolve: (value: T) => void;
  let reject: (error: Error) => void;
  let status: 'pending' | 'resolved' | 'rejected' = 'pending';

  const promise = new Promise<T>((res, rej) => {
    resolve = (value: T) => {
      status = 'resolved';
      res(value);
    };
    reject = (error: Error) => {
      status = 'rejected';
      rej(error);
    };
  });

  return {
    promise,
    resolve: resolve!,
    reject: reject!,
    status,
  };
}

