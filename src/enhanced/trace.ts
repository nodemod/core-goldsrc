/**
 * Configuration options for trace operations.
 */
export interface TraceOptions {
  /** Trace flags for filtering what to ignore (use nodemod.IGNORE constants) */
  flags?: number;
  /** Entity to ignore during the trace */
  ignore?: nodemod.Entity | null;
  /** Hull size for hull-based traces (use nodemod.HULL constants) */
  hullSize?: number;
}

/**
 * Enhanced trace result with additional computed properties and convenience flags.
 */
export interface EnhancedTraceResult extends nodemod.TraceResult {
  /** Distance traveled before hitting something */
  distance?: number;
  /** Exact 3D coordinates where the trace hit */
  hitPoint?: number[];
  /** Whether the trace hit something before reaching the end */
  didHit: boolean;
  /** Whether the trace hit the sky */
  hitSky: boolean;
  /** Whether the trace hit water */
  hitWater: boolean;
  /** Entity that was hit (if any) */
  hitEntity?: nodemod.Entity | null;
  /** Whether the trace hit a solid surface */
  hitSurface: boolean;
}

/**
 * Detailed information about the contents of a specific point in space.
 */
export interface PointContentsResult {
  /** Raw contents value from the engine */
  contents: number;
  /** Whether the point is in empty space */
  isEmpty: boolean;
  /** Whether the point is inside a solid object */
  isSolid: boolean;
  /** Whether the point is in water */
  isWater: boolean;
  /** Whether the point is in slime */
  isSlime: boolean;
  /** Whether the point is in lava */
  isLava: boolean;
  /** Whether the point is in the sky */
  isSky: boolean;
}

/**
 * Advanced tracing and physics utilities for line-of-sight, collision detection, and spatial analysis.
 * Provides enhanced trace operations with convenient result parsing and batch processing capabilities.
 * 
 * @example
 * ```typescript
 * // Basic line tracing
 * const trace = nodemodCore.trace.line([0, 0, 100], [100, 100, 100]);
 * if (trace?.didHit) {
 *   console.log(`Hit something at distance: ${trace.distance}`);
 * }
 * 
 * // Line of sight check
 * const canSee = nodemodCore.trace.canSee(player1, player2);
 * console.log(`Players can see each other: ${canSee}`);
 * 
 * // Find ground below position
 * const ground = nodemodCore.trace.findGround([100, 100, 500]);
 * if (ground?.didHit) {
 *   console.log(`Ground is at: ${ground.hitPoint}`);
 * }
 * 
 * // Check point contents
 * const contents = nodemodCore.trace.pointContents([50, 50, 50]);
 * if (contents.isWater) {
 *   console.log('Point is underwater');
 * }
 * ```
 */
export default class NodemodTrace {
  
  /**
   * Performs a line trace between two points with enhanced options and result parsing.
   * 
   * @param start - Starting point [x, y, z]
   * @param end - Ending point [x, y, z]
   * @param options - Trace configuration options
   * @returns Enhanced trace result with additional computed properties
   * 
   * @example
   * ```typescript
   * // Basic line trace
   * const trace = nodemodCore.trace.line([0, 0, 0], [100, 0, 0]);
   * 
   * // Trace ignoring monsters
   * const trace2 = nodemodCore.trace.line([0, 0, 0], [100, 0, 0], {
   *   flags: nodemod.IGNORE.MONSTERS
   * });
   * 
   * // Hull-based trace
   * const trace3 = nodemodCore.trace.line([0, 0, 0], [100, 0, 0], {
   *   hullSize: nodemod.HULL.HUMAN,
   *   ignore: player
   * });
   * ```
   */
  line(start: number[], end: number[], options: TraceOptions = {}): EnhancedTraceResult | null {
    const {
      flags = 0,
      ignore = null,
      hullSize = 0
    } = options;
    
    let result: nodemod.TraceResult;
    
    if (hullSize > 0) {
      // traceHull requires Entity, not Entity | null
      const ignoreEntity = ignore || nodemod.eng.pEntityOfEntIndex(0); // Use world entity as fallback
      result = nodemod.eng.traceHull(start, end, flags, hullSize, ignoreEntity);
    } else {
      result = nodemod.eng.traceLine(start, end, flags, ignore || null);
    }
    
    return this.enhanceTraceResult(result, start, end);
  }
  
  // Trace from entity to point
  fromEntity(entity: nodemod.Entity | number, target: nodemod.Entity | number[], options: TraceOptions = {}): EnhancedTraceResult | null {
    const entityObj = typeof entity === 'number' ? 
      nodemod.eng.pEntityOfEntIndex(entity) : entity;
      
    if (!entityObj) return null;
    
    const start = [
      entityObj.origin[0],
      entityObj.origin[1],
      entityObj.origin[2] + (entityObj.view_ofs?.[2] || 0)
    ];
    
    const end = Array.isArray(target) ? target : [
      target.origin[0],
      target.origin[1],  
      target.origin[2] + 16
    ];
    
    return this.line(start, end, { ...options, ignore: entityObj });
  }
  
  /**
   * Checks if one entity has line of sight to another entity.
   * Automatically adjusts for entity view offset and target positioning.
   * 
   * @param entity1 - Source entity or entity index
   * @param entity2 - Target entity or entity index
   * @param options - Trace configuration options
   * @returns True if entity1 can see entity2, false otherwise
   * 
   * @example
   * ```typescript
   * // Check if player can see another player
   * const canSee = nodemodCore.trace.canSee(player1, player2);
   * if (canSee) {
   *   console.log('Player 1 can see Player 2');
   * }
   * 
   * // Check line of sight ignoring other players
   * const canSeeIgnoringPlayers = nodemodCore.trace.canSee(sniper, target, {
   *   flags: nodemod.IGNORE.MONSTERS
   * });
   * ```
   */
  canSee(entity1: nodemod.Entity | number, entity2: nodemod.Entity | number, options: TraceOptions = {}): boolean {
    const entity2Obj = typeof entity2 === 'number' ? nodemod.eng.pEntityOfEntIndex(entity2) : entity2;
    if (!entity2Obj) return false;
    const trace = this.fromEntity(entity1, entity2Obj, options);
    return trace !== null && (trace.fraction >= 1.0 || trace.hitEntity === entity2);
  }

  /**
   * Checks if a point is within an entity's field of view (view cone).
   * Uses the entity's FOV setting to determine the cone angle.
   *
   * @param entity - Entity to check from (uses its origin, angles, and FOV)
   * @param point - 3D point [x, y, z] to check
   * @param use3d - If true, uses v_angle and view_ofs for accurate 3D check; if false, uses 2D check ignoring Z
   * @returns True if the point is within the entity's view cone
   *
   * @example
   * ```typescript
   * // Check if player can see a point (2D check, ignores vertical angle)
   * const canSeePoint = nodemodCore.trace.isInViewCone(player, [100, 200, 50]);
   *
   * // Full 3D check using player's actual view angle
   * const canSeePoint3D = nodemodCore.trace.isInViewCone(player, [100, 200, 50], true);
   *
   * // Check if NPC is facing the player
   * const npcFacingPlayer = nodemodCore.trace.isInViewCone(npc, player.origin);
   * ```
   */
  isInViewCone(entity: nodemod.Entity | number, point: number[], use3d: boolean = false): boolean {
    const entityObj = typeof entity === 'number' ?
      nodemod.eng.pEntityOfEntIndex(entity) : entity;

    if (!entityObj) return false;

    // Get the appropriate angles and compute forward vector
    const angles = use3d ? entityObj.v_angle : entityObj.angles;
    let forward = [0, 0, 0];
    const right = [0, 0, 0];
    const up = [0, 0, 0];
    nodemod.eng.angleVectors(angles, forward, right, up);

    // Calculate vector from entity to point (line of sight)
    let entityOrigin: number[];
    if (use3d) {
      entityOrigin = [
        entityObj.origin[0] + (entityObj.view_ofs?.[0] || 0),
        entityObj.origin[1] + (entityObj.view_ofs?.[1] || 0),
        entityObj.origin[2] + (entityObj.view_ofs?.[2] || 0)
      ];
    } else {
      entityOrigin = [...entityObj.origin];
    }

    let vecLOS = [
      point[0] - entityOrigin[0],
      point[1] - entityOrigin[1],
      point[2] - entityOrigin[2]
    ];

    // For 2D check, zero out the Z component
    if (!use3d) {
      forward[2] = 0;
      vecLOS[2] = 0;
    }

    // Normalize the line of sight vector
    const losLength = Math.sqrt(vecLOS[0] ** 2 + vecLOS[1] ** 2 + vecLOS[2] ** 2);
    if (losLength === 0) return true; // Point is at entity's origin
    vecLOS = [vecLOS[0] / losLength, vecLOS[1] / losLength, vecLOS[2] / losLength];

    // Normalize forward vector (needed for 2D case where we zeroed Z)
    const fwdLength = Math.sqrt(forward[0] ** 2 + forward[1] ** 2 + forward[2] ** 2);
    if (fwdLength > 0) {
      forward = [forward[0] / fwdLength, forward[1] / fwdLength, forward[2] / fwdLength];
    }

    // Calculate dot product
    const dot = vecLOS[0] * forward[0] + vecLOS[1] * forward[1] + vecLOS[2] * forward[2];

    // Compare against FOV (default to 90 degrees if not set)
    const fov = entityObj.fov || 90;
    // FOV is full angle, so divide by 2 and convert to radians
    const threshold = Math.cos(fov * (Math.PI / 360));

    return dot >= threshold;
  }

  // Trace downward to find ground
  findGround(origin: number[], distance: number = 4096): EnhancedTraceResult | null {
    const start = [...origin];
    const end = [origin[0], origin[1], origin[2] - distance];
    
    return this.line(start, end, { flags: nodemod.IGNORE.MONSTERS });
  }
  
  // Trace sphere/hull
  sphere(start: number[], end: number[], radius: number, options: TraceOptions = {}): EnhancedTraceResult | null {
    // traceSphere requires Entity, not Entity | null, so provide a fallback
    const ignoreEntity = options.ignore || nodemod.eng.pEntityOfEntIndex(0); // Use world entity as fallback
    const result: nodemod.TraceResult = nodemod.eng.traceSphere(
      start, 
      end, 
      options.flags || 0, 
      radius, 
      ignoreEntity
    );
    
    return this.enhanceTraceResult(result, start, end);
  }
  
  // Trace with monster hull
  monsterHull(entity: nodemod.Entity, start: number[], end: number[], options: TraceOptions = {}): nodemod.TraceMonsterHullResult {
    // traceMonsterHull requires Entity, not Entity | null
    const ignoreEntity = options.ignore || nodemod.eng.pEntityOfEntIndex(0); // Use world entity as fallback
    return nodemod.eng.traceMonsterHull(
      entity,
      start,
      end,
      options.flags || 0,
      ignoreEntity
    );
  }
  
  // Trace for texture information
  texture(entity: nodemod.Entity, start: number[], end: number[]): string {
    return nodemod.eng.traceTexture(entity, start, end);
  }
  
  // Trace projectile path
  projectile(entity: nodemod.Entity, ignore: nodemod.Entity | null = null): EnhancedTraceResult | null {
    const result: nodemod.TraceResult = nodemod.eng.traceToss(entity, ignore || entity);
    return this.enhanceTraceResult(result);
  }
  
  /**
   * Analyzes the contents of a specific point in 3D space.
   * Useful for checking if a position is in water, solid matter, or empty space.
   * 
   * @param point - 3D coordinates [x, y, z] to check
   * @returns Detailed information about what exists at that point
   * 
   * @example
   * ```typescript
   * // Check if a position is safe for teleporting
   * const contents = nodemodCore.trace.pointContents([100, 200, 300]);
   * if (contents.isEmpty) {
   *   console.log('Safe to teleport');
   * } else if (contents.isWater) {
   *   console.log('Position is underwater');
   * } else if (contents.isSolid) {
   *   console.log('Position is inside a wall');
   * }
   * 
   * // Check multiple points
   * const positions = [[0,0,0], [100,100,100], [200,200,200]];
   * positions.forEach((pos, i) => {
   *   const result = nodemodCore.trace.pointContents(pos);
   *   console.log(`Point ${i}: ${result.isEmpty ? 'empty' : 'occupied'}`);
   * });
   * ```
   */
  pointContents(point: number[]): PointContentsResult {
    const contents = nodemod.eng.pointContents(point);
    
    return {
      contents,
      isEmpty: contents === nodemod.CONTENTS.EMPTY,
      isSolid: contents === nodemod.CONTENTS.SOLID,  
      isWater: contents === nodemod.CONTENTS.WATER,
      isSlime: contents === nodemod.CONTENTS.SLIME,
      isLava: contents === nodemod.CONTENTS.LAVA,
      isSky: contents === nodemod.CONTENTS.SKY
    };
  }
  
  // Enhanced trace result with utility methods
  enhanceTraceResult(result: nodemod.TraceResult | null, start: number[] | null = null, end: number[] | null = null): EnhancedTraceResult | null {
    if (!result) return null;
    
    const distance = start && end ? (() => {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const dz = end[2] - start[2];
      const totalDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return totalDistance * result.fraction;
    })() : result.fraction;

    const hitPoint = start && end ? [
      start[0] + (end[0] - start[0]) * result.fraction,
      start[1] + (end[1] - start[1]) * result.fraction,
      start[2] + (end[2] - start[2]) * result.fraction
    ] : (result.endPos as number[] | undefined);

    return {
      ...result,
      distance,
      hitPoint,
      didHit: result.fraction < 1.0,
      hitSky: result.inOpen,
      hitWater: result.inWater,
      hitEntity: result.hit,
      hitSurface: result.fraction < 1.0 && !!result.planeNormal
    };
  }
  
  // Batch tracing utilities
  
  // Trace multiple lines at once
  multiLine(traces: Array<{start: number[], end: number[], options?: TraceOptions} | [number[], number[], TraceOptions?]>): Array<EnhancedTraceResult | null> {
    return traces.map((trace) => {
      if (Array.isArray(trace)) {
        return this.line(trace[0], trace[1], trace[2] || {});
      }
      return this.line(trace.start, trace.end, trace.options || {});
    });
  }
  
  // Find closest surface in direction
  findClosestSurface(origin: number[], direction: number[], maxDistance: number = 4096): EnhancedTraceResult | null {
    const normalized = this.normalizeVector(direction);
    const end = [
      origin[0] + normalized[0] * maxDistance,
      origin[1] + normalized[1] * maxDistance,
      origin[2] + normalized[2] * maxDistance
    ];
    
    return this.line(origin, end);
  }
  
  // Trace in all cardinal directions
  traceCardinal(origin: number[], distance: number = 512): Record<string, EnhancedTraceResult | null> {
    const directions = [
      [1, 0, 0],   // East
      [-1, 0, 0],  // West  
      [0, 1, 0],   // North
      [0, -1, 0],  // South
      [0, 0, 1],   // Up
      [0, 0, -1]   // Down
    ];
    
    const results: Record<string, EnhancedTraceResult | null> = {};
    const labels = ['east', 'west', 'north', 'south', 'up', 'down'];
    
    directions.forEach((dir, i) => {
      const end = [
        origin[0] + dir[0] * distance,
        origin[1] + dir[1] * distance,
        origin[2] + dir[2] * distance
      ];
      results[labels[i]] = this.line(origin, end);
    });
    
    return results;
  }
  
  /**
   * Checks if a rectangular area is clear of obstacles by testing all corners.
   * Useful for verifying if there's enough space to place objects or teleport players.
   * 
   * @param center - Center point of the area [x, y, z]
   * @param size - Dimensions of the area [width, length, height] (default: [64, 64, 64])
   * @returns True if the entire area is clear, false if any part is blocked
   * 
   * @example
   * ```typescript
   * // Check if there's space for a player
   * const playerSize = [32, 32, 72]; // Typical player dimensions
   * const isClear = nodemodCore.trace.isAreaClear([100, 200, 300], playerSize);
   * if (isClear) {
   *   console.log('Safe to spawn player here');
   * }
   * 
   * // Check default 64x64x64 area
   * const canPlaceItem = nodemodCore.trace.isAreaClear([50, 50, 50]);
   * ```
   */
  isAreaClear(center: number[], size: number[] = [64, 64, 64]): boolean {
    const halfSize = [size[0]/2, size[1]/2, size[2]/2];
    const corners = [
      [center[0] - halfSize[0], center[1] - halfSize[1], center[2] - halfSize[2]],
      [center[0] + halfSize[0], center[1] - halfSize[1], center[2] - halfSize[2]],
      [center[0] - halfSize[0], center[1] + halfSize[1], center[2] - halfSize[2]],
      [center[0] + halfSize[0], center[1] + halfSize[1], center[2] - halfSize[2]],
      [center[0] - halfSize[0], center[1] - halfSize[1], center[2] + halfSize[2]],
      [center[0] + halfSize[0], center[1] - halfSize[1], center[2] + halfSize[2]],
      [center[0] - halfSize[0], center[1] + halfSize[1], center[2] + halfSize[2]],
      [center[0] + halfSize[0], center[1] + halfSize[1], center[2] + halfSize[2]]
    ];
    
    return corners.every(corner => {
      const contents = this.pointContents(corner);
      return contents.isEmpty;
    });
  }
  
  // Vector utilities
  normalizeVector(vector: number[]): number[] {
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    if (length === 0) return [0, 0, 0];
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }
  
  vectorLength(vector: number[]): number {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
  }
  
  vectorDistance(v1: number[], v2: number[]): number {
    const dx = v2[0] - v1[0];
    const dy = v2[1] - v1[1]; 
    const dz = v2[2] - v1[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
