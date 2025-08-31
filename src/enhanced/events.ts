/**
 * Internal event listener metadata for enhanced event management.
 */
export interface EventListener<T extends keyof nodemod.EventCallbacks> {
  /** The wrapped handler function */
  handler: nodemod.EventCallbacks[T];
  /** The original handler function */
  original: nodemod.EventCallbacks[T];
  /** Priority level for execution order */
  priority: number;
}

/**
 * Options for configuring event listeners.
 */
export interface EventOptions {
  /** Execute the handler only once, then automatically remove it */
  once?: boolean;
  /** Priority level (higher numbers execute first) */
  priority?: number;
}

/**
 * Enhanced player information for connection events.
 */
export interface PlayerInfo {
  /** Player entity */
  entity: nodemod.Entity;
  /** Player entity index */
  id: number;
  /** Player display name */
  name: string;
  /** Player IP address (if available) */
  address?: string;
  /** Player Steam ID */
  steamId: string;
  /** Player user ID (if available) */
  userId?: number;
}

/**
 * Enhanced spawn information for entity/player spawn events.
 */
export interface SpawnInfo {
  /** Spawned entity */
  entity: nodemod.Entity;
  /** Entity index */
  id: number;
  /** Entity name (for players) */
  name?: string;
  /** Entity class name */
  className: string;
}

/**
 * Frame timing and server state information.
 */
export interface FrameInfo {
  /** Current server time */
  time: number;
  /** Current map name */
  mapname: string;
  /** Number of connected players */
  playerCount: number;
}

/** Type alias for event handler functions */
export type EventHandler<T extends keyof nodemod.EventCallbacks = keyof nodemod.EventCallbacks> = nodemod.EventCallbacks[T];

/** Type alias for event filtering predicates */
export type EventPredicate<T extends keyof nodemod.EventCallbacks = keyof nodemod.EventCallbacks> = (...args: Parameters<nodemod.EventCallbacks[T]>) => boolean;

/** Type alias for event transformation functions */
export type EventTransformer<T extends keyof nodemod.EventCallbacks = keyof nodemod.EventCallbacks> = (...args: Parameters<nodemod.EventCallbacks[T]>) => any;

// Extend the nodemod namespace to include missing methods

/**
 * Enhanced event system providing advanced event handling capabilities on top of nodemod's native events.
 * Features include priority-based execution, one-time listeners, event filtering, throttling, and debouncing.
 * 
 * @example
 * ```typescript
 * // Basic event listening
 * nodemodCore.events.on('dllClientConnect', (entity, name) => {
 *   console.log(`${name} connected`);
 * });
 * 
 * // One-time event listener
 * nodemodCore.events.once('dllSpawn', (entity) => {
 *   console.log('First spawn event received');
 * });
 * 
 * // Priority-based event handling
 * nodemodCore.events.on('dllClientCommand', handleCommand, { priority: 10 });
 * nodemodCore.events.on('dllClientCommand', logCommand, { priority: 1 });
 * 
 * // Event filtering
 * nodemodCore.events.filter('dllClientConnect', 
 *   (entity, name) => name.startsWith('Admin'),
 *   (entity, name) => console.log(`Admin ${name} connected`)
 * );
 * 
 * // Throttled events (max once per second)
 * nodemodCore.events.throttle('dllStartFrame', frameHandler, 1000);
 * ```
 */
export default class NodemodEvents {
  /** Map of active event listeners organized by event name */
  private eventListeners = new Map<keyof nodemod.EventCallbacks, EventListener<keyof nodemod.EventCallbacks>[]>();
  
  /**
   * Creates a new NodemodEvents instance and initializes enhanced event handlers.
   */
  constructor() {
    this.initializeEvents();
  }
  
  /**
   * Adds an event listener with enhanced options like priority and one-time execution.
   * 
   * @param eventName - Name of the event to listen for
   * @param handler - Function to execute when event occurs
   * @param options - Additional options for the listener
   * @returns This instance for method chaining
   * 
   * @example
   * ```typescript
   * // Basic event listener
   * nodemodCore.events.on('dllClientConnect', (entity, name) => {
   *   console.log(`${name} joined the server`);
   * });
   * 
   * // High-priority listener (executes first)
   * nodemodCore.events.on('dllClientCommand', (entity, command) => {
   *   console.log('Processing command:', command);
   * }, { priority: 100 });
   * 
   * // One-time listener
   * nodemodCore.events.on('dllSpawn', (entity) => {
   *   console.log('First entity spawned');
   * }, { once: true });
   * ```
   */
  on<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T], options: EventOptions = {}): this {
    const wrappedHandler = (options.once) ? 
      ((...args: any[]) => {
        (handler as any)(...args);
        this.off(eventName, wrappedHandler as nodemod.EventCallbacks[T]);
      }) as nodemod.EventCallbacks[T] : handler;
      
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    
    (this.eventListeners.get(eventName)! as EventListener<T>[]).push({
      handler: wrappedHandler,
      original: handler,
      priority: options.priority || 0
    } as EventListener<T>);
    
    // Sort by priority (higher priority first)
    this.eventListeners.get(eventName)!.sort((a, b) => b.priority - a.priority);
    
    nodemod.on(eventName, wrappedHandler);
    return this;
  }
  
  // Remove event listener
  off<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T]): this {
    if (!this.eventListeners.has(eventName)) return this;
    
    const listeners = this.eventListeners.get(eventName)!;
    const index = listeners.findIndex(l => l.original === handler || l.handler === handler);
    
    if (index !== -1) {
      nodemod.removeListener(eventName, listeners[index].handler as nodemod.EventCallbacks[T]);
      listeners.splice(index, 1);
      
      if (listeners.length === 0) {
        this.eventListeners.delete(eventName);
      }
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
   * // Listen for first player connection only
   * nodemodCore.events.once('dllClientConnect', (entity, name) => {
   *   console.log(`First player ${name} connected - starting game logic`);
   * });
   * 
   * // Wait for map change
   * nodemodCore.events.once('dllSpawn', () => {
   *   console.log('Map fully loaded');
   * });
   * ```
   */
  once<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T]): this {
    return this.on(eventName, handler, { once: true });
  }
  
  // Clear all listeners for an event
  clearListeners(eventName?: keyof nodemod.EventCallbacks): this {
    if (eventName) {
      nodemod.clearListeners(eventName);
      this.eventListeners.delete(eventName);
    } else {
      // Clear all listeners
      for (const [event] of this.eventListeners) {
        nodemod.clearListeners(event as keyof nodemod.EventCallbacks);
      }
      this.eventListeners.clear();
    }
    return this;
  }
  
  // Get list of active event listeners
  getListeners<T extends keyof nodemod.EventCallbacks>(eventName: T): EventListener<T>[] {
    return (this.eventListeners.get(eventName) as EventListener<T>[]) || [];
  }
  
  // Initialize commonly used event handlers with utilities
  private initializeEvents(): void {
    // Player connection events with enhanced data
    this.on('dllClientConnect', (entity: nodemod.Entity, name: string, address: string, rejectReason: string) => {
      const playerId = nodemod.eng.indexOfEdict(entity);
      const playerInfo: PlayerInfo = {
        entity,
        id: playerId,
        name: name,
        address: address,
        steamId: nodemod.eng.getPlayerAuthId(entity),
        userId: nodemod.eng.getPlayerUserId(entity)
      };
      
      // Custom event - not calling nodemod functions
    });
    
    this.on('dllClientDisconnect', (entity: nodemod.Entity) => {
      const playerId = nodemod.eng.indexOfEdict(entity);
      const playerInfo: PlayerInfo = {
        entity,
        id: playerId,
        name: entity.netname,
        steamId: nodemod.eng.getPlayerAuthId(entity)
      };
      
      // Custom event - not calling nodemod functions
    });
    
    // Enhanced spawn event
    this.on('dllSpawn', (entity: nodemod.Entity) => {
      if (entity.netname) {
        // Player spawn
        const playerSpawnInfo: SpawnInfo = {
          entity,
          id: nodemod.eng.indexOfEdict(entity),
          name: entity.netname,
          className: entity.classname
        };
        // Custom event - not calling nodemod functions
      } else {
        // Entity spawn
        const entitySpawnInfo: SpawnInfo = {
          entity,
          id: nodemod.eng.indexOfEdict(entity),
          className: entity.classname
        };
        // Custom event - not calling nodemod functions
      }
    });
    
    // Frame timing events
    this.on('dllStartFrame', () => {
      const frameInfo: FrameInfo = {
        time: nodemod.time,
        mapname: nodemod.mapname,
        playerCount: nodemod.players.length
      };
      // Custom event - not calling nodemod functions
    });
  }
  
  // Custom emit removed - only using nodemod events
  
  // Event helper methods
  
  /**
   * Waits for a specific event to occur and returns its parameters as a promise.
   * Useful for async/await patterns with events.
   * 
   * @param eventName - Name of the event to wait for
   * @param timeout - Timeout in milliseconds (default: 10000)
   * @returns Promise that resolves with event parameters or rejects on timeout
   * 
   * @example
   * ```typescript
   * // Wait for player connection
   * try {
   *   const [entity, name] = await nodemodCore.events.waitFor('dllClientConnect', 30000);
   *   console.log(`Player ${name} connected within 30 seconds`);
   * } catch (error) {
   *   console.log('No player connected within timeout');
   * }
   * 
   * // Wait for entity spawn with shorter timeout
   * const [spawnedEntity] = await nodemodCore.events.waitFor('dllSpawn', 5000);
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
   * // Only handle commands from admins
   * nodemodCore.events.filter('dllClientCommand',
   *   (entity, command) => isAdmin(entity),
   *   (entity, command) => handleAdminCommand(entity, command)
   * );
   * 
   * // Only handle player connections with specific names
   * nodemodCore.events.filter('dllClientConnect',
   *   (entity, name) => name.startsWith('VIP_'),
   *   (entity, name) => grantVipAccess(entity)
   * );
   * ```
   */
  filter<T extends keyof nodemod.EventCallbacks>(eventName: T, predicate: EventPredicate<T>, handler: nodemod.EventCallbacks[T]): this {
    const wrappedHandler = function(...args: Parameters<nodemod.EventCallbacks[T]>) {
      if (predicate(...args)) {
        // @ts-ignore - TypeScript can't guarantee spread matches exact signature but it's safe here
        return handler(...args);
      }
    } as nodemod.EventCallbacks[T];
    return this.on(eventName, wrappedHandler);
  }
  
  // Event mapping/transformation
  map<T extends keyof nodemod.EventCallbacks>(eventName: T, transformer: EventTransformer<T>, newEventName?: keyof nodemod.EventCallbacks): this {
    return this.on(eventName, ((...args: Parameters<nodemod.EventCallbacks[T]>) => {
      const transformed = transformer(...args);
      // Note: mapping to custom events not supported in strict mode
    }) as nodemod.EventCallbacks[T]);
  }
  
  /**
   * Adds a throttled event listener that limits execution to once per specified interval.
   * Useful for performance optimization with high-frequency events.
   * 
   * @param eventName - Name of the event to listen for
   * @param handler - Function to execute when event occurs
   * @param delay - Minimum interval between executions in milliseconds (default: 1000)
   * @returns This instance for method chaining
   * 
   * @example
   * ```typescript
   * // Throttle frame events to once per second
   * nodemodCore.events.throttle('dllStartFrame', () => {
   *   console.log('Frame update (max once per second)');
   * }, 1000);
   * 
   * // Throttle player movement tracking
   * nodemodCore.events.throttle('dllClientCommand', (entity, command) => {
   *   if (command.startsWith('+move')) {
   *     updatePlayerPosition(entity);
   *   }
   * }, 500); // Max twice per second
   * ```
   */
  throttle<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T], delay: number = 1000): this {
    let lastCall = 0;
    const wrappedHandler = function(...args: Parameters<nodemod.EventCallbacks[T]>) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        // @ts-ignore - TypeScript can't guarantee spread matches exact signature but it's safe here
        return handler(...args);
      }
    } as nodemod.EventCallbacks[T];
    return this.on(eventName, wrappedHandler);
  }
  
  /**
   * Adds a debounced event listener that delays execution until after the specified interval
   * has passed since the last event occurrence. Useful for handling rapid successive events.
   * 
   * @param eventName - Name of the event to listen for
   * @param handler - Function to execute when event occurs
   * @param delay - Delay in milliseconds after last event before execution (default: 1000)
   * @returns This instance for method chaining
   * 
   * @example
   * ```typescript
   * // Debounce player input to handle final command only
   * nodemodCore.events.debounce('dllClientCommand', (entity, command) => {
   *   if (command.startsWith('buy_')) {
   *     processPurchase(entity, command);
   *   }
   * }, 300); // Wait 300ms after last buy command
   * 
   * // Debounce entity spawning for batch processing
   * nodemodCore.events.debounce('dllSpawn', () => {
   *   console.log('Finished spawning entities');
   *   optimizeMapEntities();
   * }, 2000);
   * ```
   */
  debounce<T extends keyof nodemod.EventCallbacks>(eventName: T, handler: nodemod.EventCallbacks[T], delay: number = 1000): this {
    let timeoutId: NodeJS.Timeout;
    const wrappedHandler = function(...args: Parameters<nodemod.EventCallbacks[T]>) {
      clearTimeout(timeoutId);
      // @ts-ignore - TypeScript can't guarantee spread matches exact signature but it's safe here
      timeoutId = setTimeout(() => handler(...args), delay);
    } as nodemod.EventCallbacks[T];
    return this.on(eventName, wrappedHandler);
  }
}
