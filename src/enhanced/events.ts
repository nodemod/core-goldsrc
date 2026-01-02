/**
 * Enhanced event utilities providing convenience methods on top of nodemod's native events.
 *
 * Note: For low-level event handling that needs SUPERCEDE support, use nodemod.on() directly.
 * This wrapper provides utilities like once(), waitFor(), throttle(), and debounce().
 */

/** Type alias for event handler functions */
export type EventHandler<T extends keyof nodemod.EventCallbacks = keyof nodemod.EventCallbacks> = nodemod.EventCallbacks[T];

/** Type alias for event filtering predicates */
export type EventPredicate<T extends keyof nodemod.EventCallbacks = keyof nodemod.EventCallbacks> = (...args: Parameters<nodemod.EventCallbacks[T]>) => boolean;

/**
 * Enhanced event utilities for nodemod events.
 *
 * @example
 * ```typescript
 * // One-time event listener
 * nodemodCore.events.once('dllSpawn', (entity) => {
 *   console.log('First spawn event received');
 * });
 *
 * // Throttled events (max once per second)
 * nodemodCore.events.throttle('dllStartFrame', frameHandler, 1000);
 *
 * // Wait for event with timeout
 * const [entity, name] = await nodemodCore.events.waitFor('dllClientConnect', 30000);
 * ```
 */
export default class NodemodEvents {
  /** Map tracking wrapped handlers for removal */
  private wrappedHandlers = new Map<Function, Function>();

  /**
   * Adds an event listener. This is a simple wrapper around nodemod.on().
   * For most cases, use nodemod.on() directly.
   */
  on<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T]): this {
    nodemod.on(eventName, handler);
    return this;
  }

  /**
   * Removes an event listener.
   */
  off<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T]): this {
    // Check if this was a wrapped handler
    const wrapped = this.wrappedHandlers.get(handler);
    if (wrapped) {
      nodemod.removeListener(eventName, wrapped as nodemod.EventCallbacks[T]);
      this.wrappedHandlers.delete(handler);
    } else {
      nodemod.removeListener(eventName, handler);
    }
    return this;
  }

  /**
   * Adds a one-time event listener that automatically removes itself after first execution.
   *
   * @param eventName - Name of the event to listen for
   * @param handler - Function to execute when event occurs
   * @returns This instance for method chaining
   *
   * @example
   * ```typescript
   * nodemodCore.events.once('dllClientConnect', (entity, name) => {
   *   console.log(`First player ${name} connected`);
   * });
   * ```
   */
  once<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T]): this {
    const wrappedHandler = ((...args: any[]) => {
      nodemod.removeListener(eventName, wrappedHandler as nodemod.EventCallbacks[T]);
      this.wrappedHandlers.delete(handler);
      (handler as any)(...args);
    }) as nodemod.EventCallbacks[T];

    this.wrappedHandlers.set(handler, wrappedHandler);
    nodemod.on(eventName, wrappedHandler);
    return this;
  }

  /**
   * Waits for a specific event to occur and returns its parameters as a promise.
   *
   * @param eventName - Name of the event to wait for
   * @param timeout - Timeout in milliseconds (default: 10000)
   * @returns Promise that resolves with event parameters or rejects on timeout
   *
   * @example
   * ```typescript
   * try {
   *   const [entity, name] = await nodemodCore.events.waitFor('dllClientConnect', 30000);
   *   console.log(`Player ${name} connected within 30 seconds`);
   * } catch (error) {
   *   console.log('No player connected within timeout');
   * }
   * ```
   */
  waitFor<T extends keyof nodemod.EventCallbacks>(eventName: T, timeout: number = 10000): Promise<Parameters<nodemod.EventCallbacks[T]>> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.off(eventName, handler);
        reject(new Error(`Event ${eventName} timeout after ${timeout}ms`));
      }, timeout);

      const handler = ((...args: Parameters<nodemod.EventCallbacks[T]>) => {
        clearTimeout(timeoutId);
        resolve(args);
      }) as nodemod.EventCallbacks[T];

      this.once(eventName, handler);
    });
  }

  /**
   * Adds an event listener that only executes when a predicate condition is met.
   *
   * @param eventName - Name of the event to listen for
   * @param predicate - Function that returns true if the handler should execute
   * @param handler - Function to execute when event occurs and predicate is true
   * @returns This instance for method chaining
   *
   * @example
   * ```typescript
   * nodemodCore.events.filter('dllClientCommand',
   *   (entity, command) => isAdmin(entity),
   *   (entity, command) => handleAdminCommand(entity, command)
   * );
   * ```
   */
  filter<T extends keyof nodemod.EventCallbacks>(eventName: T, predicate: EventPredicate<T>, handler: nodemod.EventCallbacks[T]): this {
    const wrappedHandler = ((...args: Parameters<nodemod.EventCallbacks[T]>) => {
      if (predicate(...args)) {
        (handler as any)(...args);
      }
    }) as nodemod.EventCallbacks[T];

    this.wrappedHandlers.set(handler, wrappedHandler);
    nodemod.on(eventName, wrappedHandler);
    return this;
  }

  /**
   * Adds a throttled event listener that limits execution to once per specified interval.
   * Useful for performance optimization with high-frequency events like dllStartFrame.
   *
   * @param eventName - Name of the event to listen for
   * @param handler - Function to execute when event occurs
   * @param delay - Minimum interval between executions in milliseconds (default: 1000)
   * @returns This instance for method chaining
   *
   * @example
   * ```typescript
   * nodemodCore.events.throttle('dllStartFrame', () => {
   *   console.log('Frame update (max once per second)');
   * }, 1000);
   * ```
   */
  throttle<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T], delay: number = 1000): this {
    let lastCall = 0;
    const wrappedHandler = ((...args: Parameters<nodemod.EventCallbacks[T]>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        (handler as any)(...args);
      }
    }) as nodemod.EventCallbacks[T];

    this.wrappedHandlers.set(handler, wrappedHandler);
    nodemod.on(eventName, wrappedHandler);
    return this;
  }

  /**
   * Adds a debounced event listener that delays execution until after the specified interval
   * has passed since the last event occurrence.
   *
   * @param eventName - Name of the event to listen for
   * @param handler - Function to execute when event occurs
   * @param delay - Delay in milliseconds after last event before execution (default: 1000)
   * @returns This instance for method chaining
   *
   * @example
   * ```typescript
   * nodemodCore.events.debounce('dllSpawn', () => {
   *   console.log('Finished spawning entities');
   *   optimizeMapEntities();
   * }, 2000);
   * ```
   */
  debounce<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T], delay: number = 1000): this {
    let timeoutId: NodeJS.Timeout;
    const wrappedHandler = ((...args: Parameters<nodemod.EventCallbacks[T]>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => (handler as any)(...args), delay);
    }) as nodemod.EventCallbacks[T];

    this.wrappedHandlers.set(handler, wrappedHandler);
    nodemod.on(eventName, wrappedHandler);
    return this;
  }
}
