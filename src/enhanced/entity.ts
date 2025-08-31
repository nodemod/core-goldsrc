import type NodemodUtil from '../utils/util';

/**
 * Extended entity interface that allows dynamic property access.
 * Useful for setting custom entity properties not defined in the base interface.
 */
export interface DynamicEntity extends nodemod.Entity {
  /** Allow dynamic property access */
  [key: string]: any;
}

/**
 * Criteria for filtering entities in search operations.
 */
export interface EntityCriteria {
  /** Filter by entity class name */
  className?: string;
  /** Filter by entity target name */
  targetName?: string;
  /** Filter by entity target */
  target?: string;
  /** Filter by model path */
  model?: string;
  /** Filter by health value */
  health?: number;
  /** Filter by entity flags (bitwise AND check) */
  flags?: number;
  /** Filter by spawn flags (bitwise AND check) */
  spawnflags?: number;
}

/**
 * Enhanced entity wrapper providing convenient property access and utility methods.
 * Extends nodemod.Entity directly for full compatibility with nodemod.eng functions.
 */
export interface EntityWrapper extends nodemod.Entity {
  /** Remove the entity from the world */
  remove(): void;
  /** Make entity static (non-moving) */
  makeStatic(): void;
  /** Set entity bounding box size */
  setSize(mins: number[], maxs: number[]): void;
  /** Drop entity to floor and return drop distance */
  dropToFloor(): number;
  /** Check if entity is on the floor */
  isOnFloor(): number;
  /** Emit a sound from this entity */
  emitSound(channel: number, sound: string, volume?: number, attenuation?: number, flags?: number, pitch?: number): void;
  /** Get distance to another entity */
  getDistance(target: EntityWrapper | nodemod.Entity): number;
  /** Get illumination level at entity position */
  getIllum(): number;
  /** Set callback for when this entity is touched */
  onTouch(callback: (other: EntityWrapper | null) => void): void;
  /** Set callback for when this entity is used */
  onUse(callback: (other: EntityWrapper | null) => void): void;

  use(): void;

  touch(other: nodemod.Entity): void;
}

// Extend the nodemod namespace to include missing methods

/**
 * Comprehensive entity management system providing enhanced entity creation, searching, and manipulation.
 * Wraps raw nodemod entities with convenient property accessors and utility methods.
 * 
 * @example
 * ```typescript
 * // Find all players
 * const players = nodemodCore.entity.find({ className: 'player' });
 * players.forEach(player => {
 *   console.log(`Player at: ${player.origin}`);
 * });
 * 
 * // Create a light entity
 * const light = nodemodCore.entity.createLight([100, 200, 300], '_light', 500);
 * if (light) {
 *   light.targetName = 'my_light';
 * }
 * 
 * // Find entities near a position
 * const nearby = nodemodCore.entity.findInSphere([0, 0, 0], 512, 'weapon_ak47');
 * console.log(`Found ${nearby.length} AK47s nearby`);
 * ```
 */
export default class NodemodEntity {
  /** Utility service for entity operations */
  private util: NodemodUtil;

  /**
   * Creates a new NodemodEntity instance.
   * 
   * @param utilService - Utility service for entity operations
   */
  constructor(utilService: NodemodUtil) {
    this.util = utilService;
  }
  
  /**
   * Creates a new entity with optional class name.
   * 
   * @param className - Entity class name (e.g., 'info_player_start', 'weapon_ak47')
   * @returns EntityWrapper for the created entity, or null if creation failed
   * 
   * @example
   * ```typescript
   * // Create a generic entity
   * const entity = nodemodCore.entity.create();
   * 
   * // Create a specific entity class
   * const weapon = nodemodCore.entity.create('weapon_ak47');
   * if (weapon) {
   *   weapon.origin = [100, 200, 300];
   * }
   * ```
   */
  create(className: string | null = null): EntityWrapper | null {
    // TODO: Access engine service through dependency injection
    let entity: nodemod.Entity | null = null;
    
    if (className) {
      // Try to create named entity first
      entity = nodemod.eng.createNamedEntity(nodemod.eng.allocString(className));
      
      // If createNamedEntity failed, fall back to createEntity and set classname manually
      if (!entity) {
        entity = nodemod.eng.createEntity();
        if (entity) {
          entity.classname = className;
        }
      }
    } else {
      entity = nodemod.eng.createEntity();
    }
    
    return entity ? this.wrap(entity) : null;
  }
  
  /**
   * Wraps a raw nodemod entity with enhanced functionality while preserving nodemod.eng compatibility.
   * The entity object itself is returned with additional methods attached, ensuring full compatibility
   * with core nodemod.eng functions.
   * 
   * @param entity - The raw nodemod entity to wrap
   * @returns EntityWrapper with enhanced functionality, or null if entity is invalid
   * 
   * @example
   * ```typescript
   * const rawEntity = nodemod.eng.pEntityOfEntIndex(1);
   * const wrapped = nodemodCore.entity.wrap(rawEntity);
   * if (wrapped) {
   *   console.log(`Entity class: ${wrapped.classname}`);
   *   wrapped.health = 100;
   *   wrapped.emitSound(0, 'items/healthkit.wav');
   *   // Still compatible with nodemod.eng functions:
   *   nodemod.eng.setOrigin(wrapped, [0, 0, 0]);
   * }
   * ```
   */
  wrap(entity: nodemod.Entity): EntityWrapper | null {
    if (!entity) return null;
    
    const self = this;
    
    // Extend the actual entity object with additional methods
    // This preserves full compatibility with nodemod.eng functions
    const wrapper = entity as EntityWrapper;
    
    // Add wrapper-specific properties (read-only)
    Object.defineProperty(wrapper, 'id', {
      value: nodemod.eng.indexOfEdict(entity),
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    // Add utility methods
    wrapper.remove = function(): void {
      nodemod.eng.removeEntity(entity);
    };
    
    wrapper.makeStatic = function(): void {
      nodemod.eng.makeStatic(entity);
    };
    
    wrapper.setSize = function(mins: number[], maxs: number[]): void {
      nodemod.eng.setSize(entity, mins, maxs);
    };
    
    wrapper.dropToFloor = function(): number {
      return nodemod.eng.dropToFloor(entity);
    };
    
    wrapper.isOnFloor = function(): number {
      return nodemod.eng.entIsOnFloor(entity);
    };
    
    wrapper.emitSound = function(channel: number, sound: string, volume: number = 1, attenuation: number = 1, flags: number = 0, pitch: number = 100): void {
      nodemod.eng.emitSound(entity, channel, sound, volume, attenuation, flags, pitch);
    };
    
    wrapper.getDistance = function(target: EntityWrapper | nodemod.Entity): number {
      if (!target) return -1;
      
      // NOTE: Brush entities (func_wall, func_breakable, etc.) typically have their
      // origin at [0,0,0] even though their actual geometry is elsewhere in the world.
      // This distance calculation uses the origin property, which may not represent
      // the actual location of brush entities. Use findInSphere for accurate proximity
      // detection as it checks against actual entity bounds.
      const origin1 = entity.origin;
      const origin2 = target.origin;
      const dx = origin1[0] - origin2[0];
      const dy = origin1[1] - origin2[1];
      const dz = origin1[2] - origin2[2];
      
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };
    
    wrapper.getIllum = function(): number {
      return nodemod.eng.getEntityIllum(entity);
    };
    
    // Touch/Use handlers
    wrapper.onTouch = function(callback: (other: EntityWrapper | null) => void): void {
      // Use direct nodemod events to avoid circular dependency
      nodemod.on('dllTouch', (touched: nodemod.Entity, other: nodemod.Entity) => {
        if (touched === entity) {
          callback(self.wrap(other));
        }
      });
    };
    
    wrapper.onUse = function(callback: (other: EntityWrapper | null) => void): void {
      nodemod.on('dllUse', (used: nodemod.Entity, other: nodemod.Entity) => {
        if (used === entity) {
          callback(self.wrap(other));
        }
      });
    };

    wrapper.use = function(): void {
      nodemod.dll.use(entity, entity);
    }

    wrapper.touch = function(other: nodemod.Entity): void {
      nodemod.dll.touch(entity, other);
    }
    
    return wrapper;
  }
  
  /**
   * Finds entities matching the specified criteria.
   * 
   * @param criteria - Search criteria to filter entities
   * @returns Array of EntityWrapper objects matching the criteria
   * 
   * @example
   * ```typescript
   * // Find all players
   * const players = nodemodCore.entity.find({ className: 'player' });
   * 
   * // Find entities with specific target name
   * const targets = nodemodCore.entity.find({ targetName: 'button_secret' });
   * 
   * // Find entities with specific flags
   * const onGroundEntities = nodemodCore.entity.find({ 
   *   flags: nodemod.FL.ONGROUND 
   * });
   * 
   * // Combine multiple criteria
   * const healthyPlayers = nodemodCore.entity.find({
   *   className: 'player',
   *   health: 100
   * });
   * ```
   */
  find(criteria: EntityCriteria): EntityWrapper[] {
    const results: EntityWrapper[] = [];

    const seenIds = new Set<number>();
    let entity: nodemod.Entity | null = null;
    
    if (criteria.className) {
      entity = nodemod.eng.findEntityByString(null!, 'classname', criteria.className);
      while (entity) {
        const entityId = nodemod.eng.indexOfEdict(entity);
        if (seenIds.has(entityId)) {
          break;
        }
        seenIds.add(entityId);

        if (this.matchesCriteria(entity, criteria)) {
          const wrapped = this.wrap(entity);
          if (wrapped) results.push(wrapped);
        }
        const nextEntity = nodemod.eng.findEntityByString(entity, 'classname', criteria.className);
        if (nextEntity === entity) break; // Prevent infinite loop
        entity = nextEntity;
      }
    } else if (criteria.targetName) {
      entity = nodemod.eng.findEntityByString(null!, 'targetname', criteria.targetName);
      while (entity) {
        const entityId = nodemod.eng.indexOfEdict(entity);
        if (seenIds.has(entityId)) {
          break;
        }
        seenIds.add(entityId);

        if (this.matchesCriteria(entity, criteria)) {
          const wrapped = this.wrap(entity);
          if (wrapped) results.push(wrapped);
        }
        const nextEntity = nodemod.eng.findEntityByString(entity, 'targetname', criteria.targetName);
        if (nextEntity === entity) break; // Prevent infinite loop
        entity = nextEntity;
      }
    } else {
      // Find all entities matching criteria
      for (let i = 1; i < nodemod.eng.numberOfEntities(); i++) {
        entity = nodemod.eng.pEntityOfEntIndex(i);
        if (entity && this.matchesCriteria(entity, criteria)) {
          const wrapped = this.wrap(entity);
          if (wrapped) results.push(wrapped);
        }
      }
    }
    
    return results;
  }
  
  /**
   * Finds the first entity matching the specified criteria.
   * Convenience method for when you only need one result.
   * 
   * @param criteria - Search criteria to filter entities
   * @returns First EntityWrapper matching criteria, or null if none found
   * 
   * @example
   * ```typescript
   * // Find first player
   * const player = nodemodCore.entity.findOne({ className: 'player' });
   * if (player) {
   *   console.log(`Player health: ${player.health}`);
   * }
   * 
   * // Find specific target
   * const secretButton = nodemodCore.entity.findOne({ 
   *   targetName: 'secret_button' 
   * });
   * ```
   */
  findOne(criteria: EntityCriteria): EntityWrapper | null {
    const results = this.find(criteria);
    return results.length > 0 ? results[0] : null;
  }
  
  /**
   * Finds entities within a spherical radius of a position.
   * Uses actual entity bounds, not just origin points - works correctly with brush entities.
   * 
   * @param origin - Center position [x, y, z] to search from
   * @param radius - Search radius in world units
   * @param className - Optional filter by entity class name
   * @returns Array of EntityWrapper objects within the sphere
   * 
   * @example
   * ```typescript
   * // Find all entities near player
   * const playerPos = [100, 200, 300];
   * const nearbyEntities = nodemodCore.entity.findInSphere(playerPos, 512);
   * 
   * // Find specific entity types nearby
   * const nearbyWeapons = nodemodCore.entity.findInSphere(
   *   playerPos, 
   *   256, 
   *   'weapon_ak47'
   * );
   * 
   * // Find entities in explosion radius
   * const explosionPos = [0, 0, 0];
   * const affected = nodemodCore.entity.findInSphere(explosionPos, 200);
   * affected.forEach(entity => {
   *   // Apply damage logic
   * });
   * ```
   */
  findInSphere(origin: number[], radius: number, className: string | null = null): EntityWrapper[] {
    const results: EntityWrapper[] = [];
    
    // HACK: pfnFindEntityInSphere is supposed to return null when no more entities are found,
    // but it doesn't - it keeps returning entities indefinitely, causing infinite loops.
    // We work around this by tracking entity IDs we've already seen.
    
    // NOTE: findEntityInSphere checks against actual entity bounds, not just origin.
    // For brush entities (func_wall, func_breakable, etc.) with origin at [0,0,0],
    // it correctly detects if their geometry is within the sphere radius.
    const seenIds = new Set<number>();
    let entity = nodemod.eng.findEntityInSphere(null!, origin, radius);
    
    while (entity) {
      const entityId = nodemod.eng.indexOfEdict(entity);
      
      // Break if we've seen this entity before to prevent infinite loops
      if (seenIds.has(entityId)) {
        break;
      }
      seenIds.add(entityId);
      
      if (!className || entity.classname === className) {
        const wrapped = this.wrap(entity);
        if (wrapped) results.push(wrapped);
      }
      entity = nodemod.eng.findEntityInSphere(entity, origin, radius);
    }
    
    return results;
  }
  
  // Get entity by ID
  getById(id: number): EntityWrapper | null {
    const entity = nodemod.eng.pEntityOfEntIndex(id);
    return entity ? this.wrap(entity) : null;
  }
  
  // Get all entities
  getAll(): EntityWrapper[] {
    const results: EntityWrapper[] = [];
    
    for (let i = 1; i < nodemod.eng.numberOfEntities(); i++) {
      const entity = nodemod.eng.pEntityOfEntIndex(i);
      if (entity && entity.classname) {
        const wrapped = this.wrap(entity);
        if (wrapped) results.push(wrapped);
      }
    }
    
    return results;
  }
  
  // Helper to match entity criteria
  private matchesCriteria(entity: nodemod.Entity, criteria: EntityCriteria): boolean {
    for (const [key, value] of Object.entries(criteria)) {
      if (key === 'className' && entity.classname !== value) return false;
      if (key === 'targetName' && entity.targetname !== value) return false;
      if (key === 'target' && entity.target !== value) return false;
      if (key === 'model' && entity.model !== value) return false;
      if (key === 'health' && entity.health !== value) return false;
      if (key === 'flags' && typeof value === 'number' && (entity.flags & value) !== value) return false;
      if (key === 'spawnflags' && typeof value === 'number' && (entity.spawnflags & value) !== value) return false;
    }
    return true;
  }
  
  /**
   * Creates a light entity at the specified position.
   * 
   * @param origin - Position [x, y, z] for the light
   * @param color - Light color property name (default: '_light')
   * @param brightness - Light brightness value (default: 300)
   * @returns EntityWrapper for the created light, or null if creation failed
   * 
   * @example
   * ```typescript
   * // Create standard light
   * const light = nodemodCore.entity.createLight([100, 200, 300]);
   * 
   * // Create colored light
   * const redLight = nodemodCore.entity.createLight([0, 0, 0], '_light', 500);
   * if (redLight) {
   *   (redLight as any)._color = '255 0 0'; // Red color
   * }
   * ```
   */
  createLight(origin: number[], color: string = '_light', brightness: number = 300): EntityWrapper | null {
    const light = this.create('light');
    if (light) {
      light.origin = origin;
      (light as DynamicEntity)[color] = brightness;
    }
    return light;
  }
  
  createInfo(className: string, origin: number[], angles: number[] = [0, 0, 0]): EntityWrapper | null {
    const info = this.create(className);
    if (info) {
      info.origin = origin;
      info.angles = angles;
    }
    return info;
  }
  
  createTrigger(className: string, origin: number[], size: number[] = [64, 64, 64]): EntityWrapper | null {
    const trigger = this.create(className);
    if (trigger) {
      trigger.origin = origin;
      trigger.setSize(
        [-size[0]/2, -size[1]/2, -size[2]/2],
        [size[0]/2, size[1]/2, size[2]/2]
      );
    }
    return trigger;
  }
  
  /**
   * Removes all entities matching the specified criteria.
   * 
   * @param criteria - Search criteria to filter entities for removal
   * @returns Number of entities removed
   * 
   * @example
   * ```typescript
   * // Remove all weapons from the map
   * const removed = nodemodCore.entity.removeAll({ 
   *   className: 'weapon_ak47' 
   * });
   * console.log(`Removed ${removed} AK47s`);
   * 
   * // Remove entities with specific target name
   * nodemodCore.entity.removeAll({ 
   *   targetName: 'cleanup_target' 
   * });
   * 
   * // Remove all low-health entities
   * nodemodCore.entity.removeAll({ 
   *   health: 1 
   * });
   * ```
   */
  removeAll(criteria: EntityCriteria): number {
    const entities = this.find(criteria);
    entities.forEach(entity => entity.remove());
    return entities.length;
  }
}
