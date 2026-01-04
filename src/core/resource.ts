/**
 * Function type for precaching operations.
 */
export type PrecacheFunction = () => void;

/**
 * Callback function executed after a resource is precached.
 */
export type PrecacheCallback = (id: number) => void;

/**
 * Configuration for a resource to be precached.
 */
export interface ResourceItem {
  /** Type of resource (model, sound, or generic file) */
  type: 'model' | 'sound' | 'generic';
  /** File path relative to the game directory */
  path: string;
}

// Extend the nodemod namespace to include missing methods

/**
 * Enhanced resource management system with queuing for game assets.
 * Handles precaching of models, sounds, and generic files with automatic queue processing on map spawn.
 * 
 * @example
 * ```typescript
 * // Precache a single sound
 * await nodemodCore.resource.precacheSound('weapons/ak47/ak47-1.wav');
 * 
 * // Precache a model with callback
 * await nodemodCore.resource.precacheModel('models/player/terror/terror.mdl');
 * 
 * // Batch precache multiple resources
 * await nodemodCore.resource.precacheBatch([
 *   { type: 'sound', path: 'weapons/ak47/ak47-1.wav' },
 *   { type: 'model', path: 'models/w_ak47.mdl' },
 *   { type: 'generic', path: 'sprites/muzzleflash.spr' }
 * ]);
 * ```
 */
export default class NodemodResource {
  /** Queue of precaching functions to execute on map spawn */
  private listToPrecache: PrecacheFunction[] = [];
  /** Flag to ensure precache only runs once per map (on worldspawn) */
  private precacheCalled: boolean = false;

  /**
   * Creates a new NodemodResource instance and sets up event handlers.
   * Automatically processes the precache queue when the worldspawn entity spawns.
   * This matches AMXX's plugin_precache behavior which fires during DispatchSpawn
   * of the first entity (worldspawn).
   */
  constructor() {
    // Process precache queue on first entity spawn (worldspawn)
    nodemod.on('dllSpawn', () => {
      if (!this.precacheCalled) {
        this.precacheCalled = true;
        while (this.listToPrecache.length) {
          const fn = this.listToPrecache.pop();
          if (fn) fn();
        }
      }
    });

    // Reset precache flag when map ends so next map can precache
    nodemod.on('dllServerDeactivate', () => {
      this.precacheCalled = false;
    });
  }

  /**
   * Queues a sound file for precaching.
   * The actual precaching occurs when the map spawns.
   * 
   * @param path - Path to the sound file (relative to game directory)
   * @param cb - Optional callback executed with the precache ID
   * 
   * @example
   * ```typescript
   * // Basic sound precaching
   * await nodemodCore.resource.precacheSound('weapons/ak47/ak47-1.wav');
   * 
   * // With callback
   * await nodemodCore.resource.precacheSound('ambient/water/water1.wav', (id) => {
   *   console.log(`Sound precached with ID: ${id}`);
   * });
   * ```
   */
  async precacheSound(path: string, cb: PrecacheCallback = () => {}): Promise<void> {
    this.listToPrecache.push(() => {
      const id = nodemod.eng.precacheSound(path);
      cb(id);
    });
  }

  /**
   * Queues a model file for precaching.
   * Returns a promise that resolves with the precache ID when the map spawns.
   * 
   * @param path - Path to the model file (relative to game directory)
   * @returns Promise resolving to the precache ID
   * 
   * @example
   * ```typescript
   * const modelId = await nodemodCore.resource.precacheModel('models/w_ak47.mdl');
   * console.log(`Model precached with ID: ${modelId}`);
   * ```
   */
  precacheModel(path: string): Promise<number> {
    return new Promise((resolve) => {
      this.listToPrecache.push(() => {
        const id = nodemod.eng.precacheModel(path);
        console.log(path, id);
        resolve(id);
      });
    });
  }

  /**
   * Queues a generic file for precaching.
   * Returns a promise that resolves with the precache ID when the map spawns.
   * 
   * @param path - Path to the generic file (relative to game directory)
   * @returns Promise resolving to the precache ID
   * 
   * @example
   * ```typescript
   * const spriteId = await nodemodCore.resource.precacheGeneric('sprites/muzzleflash.spr');
   * console.log(`Sprite precached with ID: ${spriteId}`);
   * ```
   */
  precacheGeneric(path: string): Promise<number> {
    return new Promise((resolve) => {
      this.listToPrecache.push(() => {
        const id = nodemod.eng.precacheGeneric(path);
        console.log(path, id);
        resolve(id);
      });
    });
  }

  /**
   * Precaches multiple resources in batch.
   * More efficient than precaching resources individually.
   * 
   * @param resources - Array of resources to precache
   * @returns Promise resolving to array of precache IDs (or void for sounds with no callback)
   * 
   * @example
   * ```typescript
   * const resources = [
   *   { type: 'sound', path: 'weapons/ak47/ak47-1.wav' },
   *   { type: 'model', path: 'models/w_ak47.mdl' },
   *   { type: 'generic', path: 'sprites/muzzleflash.spr' }
   * ];
   * 
   * const results = await nodemodCore.resource.precacheBatch(resources);
   * console.log('All resources precached:', results);
   * ```
   */
  precacheBatch(resources: ResourceItem[]): Promise<(number | void)[]> {
    const promises: Promise<number | void>[] = [];
    
    resources.forEach(resource => {
      if (resource.type === 'model') {
        promises.push(this.precacheModel(resource.path));
      } else if (resource.type === 'sound') {
        promises.push(this.precacheSound(resource.path));
      } else if (resource.type === 'generic') {
        promises.push(this.precacheGeneric(resource.path));
      }
    });

    return Promise.all(promises);
  }

  /**
   * Gets the current number of queued precaching operations.
   * 
   * @returns Number of items in the precache queue
   * 
   * @example
   * ```typescript
   * console.log(`${nodemodCore.resource.getQueueLength()} items queued for precaching`);
   * ```
   */
  getQueueLength(): number {
    return this.listToPrecache.length;
  }

  /**
   * Clears all queued precaching operations.
   * Use with caution as this will prevent queued resources from being precached.
   * 
   * @example
   * ```typescript
   * // Clear all pending precache operations
   * nodemodCore.resource.clearQueue();
   * console.log('Precache queue cleared');
   * ```
   */
  clearQueue(): void {
    this.listToPrecache = [];
  }
}
