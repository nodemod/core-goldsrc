import type NodemodUtil from '../utils/util';
import type NodemodMsg from '../core/msg';
import { MsgTypes } from '../core/msg';
import type NodemodSound from '../core/sound';

/**
 * Extended entity interface with player-specific properties.
 */
export interface PlayerEntity extends nodemod.Entity {
  /** Number of player deaths */
  deaths?: number;
}

/**
 * Comprehensive player information with enhanced functionality.
 * Includes both properties and convenience methods for player management.
 */
export interface PlayerInfo {
  /** Player entity reference */
  entity: nodemod.Entity;
  /** Player entity index */
  id: number;
  /** Player display name */
  name: string;
  /** Steam ID */
  steamId: string;
  /** User ID */
  userId: number;
  /** WON ID */
  wonId: number;
  /** Current health */
  health: number;
  /** Current armor value */
  armor: number;
  /** Kill count (frags) */
  frags: number;
  /** Death count */
  deaths: number;
  /** Position coordinates [x, y, z] */
  origin: number[];
  /** View angles [pitch, yaw, roll] */
  angles: number[];
  /** Movement velocity [x, y, z] */
  velocity: number[];
  /** Whether player is alive */
  isAlive: boolean;
  /** Whether player is connected */
  isConnected: boolean;
  /** Player team number */
  team: number;
  /** Player model name */
  model: string;
  /** Top color value */
  topColor: number;
  /** Bottom color value */
  bottomColor: number;
  /** Send message to this player */
  sendMessage: (message: string) => void;
  /** Teleport player to position */
  teleport: (origin: number[], angles?: number[] | null) => void;
  /** Kill this player */
  kill: () => void;
  /** Kick this player */
  kick: (reason?: string) => void;
  /** Ban this player */
  ban: (duration?: number, reason?: string) => void;
}

/**
 * Basic player statistics for scoreboards and tracking.
 */
export interface PlayerStats {
  /** Player entity index */
  id: number;
  /** Player display name */
  name: string;
  /** Kill count */
  frags: number;
  /** Death count */
  deaths: number;
  /** Current health */
  health: number;
  /** Current armor */
  armor: number;
  /** Steam ID */
  steamId: string;
}

/**
 * Enhanced player management system providing comprehensive player operations and information.
 * Handles player lookup, messaging, teleportation, moderation, and statistics.
 * 
 * @example
 * ```typescript
 * // Get all connected players
 * const players = nodemodCore.player.getAll();
 * players.forEach(player => {
 *   console.log(`${player.name}: ${player.frags} kills, ${player.deaths} deaths`);
 * });
 * 
 * // Find a specific player
 * const admin = nodemodCore.player.getByName('AdminPlayer');
 * if (admin) {
 *   admin.sendMessage('Welcome back, admin!');
 *   admin.teleport([100, 200, 300]);
 * }
 * 
 * // Broadcast message to all players
 * nodemodCore.player.broadcast('Round starting in 10 seconds!', 'center');
 * 
 * // Get players near a position
 * const nearby = nodemodCore.player.getPlayersInRadius([0, 0, 0], 500);
 * nearby.forEach(player => {
 *   player.sendMessage('You are near spawn!');
 * });
 * ```
 */
export default class NodemodPlayer {
  /** Utility service for entity operations */
  private util: NodemodUtil;
  /** Message service for player communication */
  private msg: NodemodMsg;
  /** Sound service for audio feedback */
  private sound: NodemodSound;

  /**
   * Creates a new NodemodPlayer instance.
   * 
   * @param utilService - Utility service for entity operations
   * @param msgService - Message service for player communication
   * @param soundService - Sound service for audio feedback
   */
  constructor(utilService: NodemodUtil, msgService: NodemodMsg, soundService: NodemodSound) {
    this.util = utilService;
    this.msg = msgService;
    this.sound = soundService;
  }
  
  /**
   * Gets all connected players with enhanced information.
   * 
   * @returns Array of PlayerInfo objects for all connected players
   * 
   * @example
   * ```typescript
   * const players = nodemodCore.player.getAll();
   * console.log(`${players.length} players online`);
   * 
   * players.forEach(player => {
   *   if (player.health < 25) {
   *     player.sendMessage('Your health is low!', 'hud');
   *   }
   * });
   * ```
   */
  getAll(): PlayerInfo[] {
    return nodemod.players.map((entity: nodemod.Entity) => this.getPlayerInfo(entity)).filter(p => p !== null) as PlayerInfo[];
  }
  
  /**
   * Gets a player by their entity index.
   * 
   * @param id - Entity index of the player
   * @returns PlayerInfo object or null if not found
   * 
   * @example
   * ```typescript
   * const player = nodemodCore.player.getById(1);
   * if (player) {
   *   console.log(`Player 1 is ${player.name}`);
   * }
   * ```
   */
  getById(id: number): PlayerInfo | null {
    const entity = nodemod.eng.pEntityOfEntIndex(id);
    return entity && entity.netname ? this.getPlayerInfo(entity) : null;
  }
  
  /**
   * Gets a player by their Steam ID.
   * 
   * @param steamId - Steam ID to search for
   * @returns PlayerInfo object or null if not found
   * 
   * @example
   * ```typescript
   * const player = nodemodCore.player.getBySteamId('STEAM_0:1:12345');
   * if (player) {
   *   console.log(`Found player: ${player.name}`);
   * }
   * ```
   */
  getBySteamId(steamId: string): PlayerInfo | null {
    const entity = nodemod.players.find((p: nodemod.Entity) => nodemod.eng.getPlayerAuthId(p) === steamId);
    return entity ? this.getPlayerInfo(entity) : null;
  }
  
  /**
   * Gets a player by their name.
   * 
   * @param name - Player name to search for (exact match)
   * @returns PlayerInfo object or null if not found
   * 
   * @example
   * ```typescript
   * const admin = nodemodCore.player.getByName('AdminPlayer');
   * if (admin) {
   *   admin.sendMessage('Admin privileges detected');
   * }
   * ```
   */
  getByName(name: string): PlayerInfo | null {
    const entity = nodemod.players.find((p: nodemod.Entity) => p.netname === name);
    return entity ? this.getPlayerInfo(entity) : null;
  }
  
  // Get comprehensive player information
  getPlayerInfo(entity: nodemod.Entity): PlayerInfo | null {
    if (!entity || !entity.netname) return null;
    
    const id = nodemod.eng.indexOfEdict(entity);
    const infoBuffer = nodemod.eng.getInfoKeyBuffer(entity);
    
    return {
      entity,
      id,
      name: entity.netname,
      steamId: nodemod.eng.getPlayerAuthId(entity),
      userId: nodemod.eng.getPlayerUserId(entity),
      wonId: nodemod.eng.getPlayerWONId(entity),
      
      // Player state
      health: entity.health,
      armor: entity.armorvalue,
      frags: entity.frags,
      deaths: (entity as PlayerEntity).deaths || 0,
      
      // Position & movement
      origin: [entity.origin[0], entity.origin[1], entity.origin[2]],
      angles: [entity.angles[0], entity.angles[1], entity.angles[2]],
      velocity: [entity.velocity[0], entity.velocity[1], entity.velocity[2]],
      
      // Status
      isAlive: entity.health > 0,
      isConnected: true,
      team: this.getPlayerTeam(entity),
      
      // Info keys
      model: nodemod.eng.infoKeyValue(infoBuffer, 'model') || '',
      topColor: parseInt(nodemod.eng.infoKeyValue(infoBuffer, 'topcolor') || '0'),
      bottomColor: parseInt(nodemod.eng.infoKeyValue(infoBuffer, 'bottomcolor') || '0'),
      
      // Utility methods
      sendMessage: (message: string) => this.sendMessage(entity, message),
      teleport: (origin: number[], angles: number[] | null = null) => this.teleport(entity, origin, angles),
      kill: () => this.kill(entity),
      kick: (reason = '') => this.kick(entity, reason),
      ban: (duration = 0, reason = '') => this.ban(entity, duration, reason)
    };
  }
  
  // Get player team (game-specific logic may be needed)
  getPlayerTeam(entity: nodemod.Entity): number {
    // Default implementation - may need game-specific override
    return entity.team || 0;
  }
  
  /**
   * Sends a message to a player using various display methods.
   * 
   * @param entity - Target player entity
   * @param message - Message text to send
   * @param type - Message display type ('chat', 'hud', 'console', 'center')
   * 
   * @example
   * ```typescript
   * const player = nodemodCore.player.getById(1);
   * if (player) {
   *   // Different message types
   *   nodemodCore.player.sendMessage(player.entity, 'Welcome!', 'chat');
   *   nodemodCore.player.sendMessage(player.entity, 'Health: 100', 'hud');
   *   nodemodCore.player.sendMessage(player.entity, 'Debug info', 'console');
   *   nodemodCore.player.sendMessage(player.entity, 'ROUND START!', 'center');
   * }
   * ```
   */
  sendMessage(entity: nodemod.Entity, message: string, type: string = 'chat'): void {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return;
    
    switch (type) {
      case 'chat':
        this.util.sendChat(message, entityObj);
        break;
      case 'hud':
        this.util.showHudText(entityObj, message);
        break;
      case 'console':
        nodemod.eng.clientPrintf(entityObj, 1, `${message}\n`);
        break;
      case 'center':
        this.msg.send({
          type: MsgTypes.centerprint,
          entity: entityObj,
          data: [{ type: 'string', value: message }]
        });
        break;
    }
  }
  
  // Teleport player
  teleport(entity: nodemod.Entity, origin: number[], angles: number[] | null = null): boolean {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return false;
    
    // Set origin
    nodemod.eng.setOrigin(entityObj, origin);
    
    // Set angles if provided
    if (angles) {
      entityObj.angles[0] = angles[0] || 0;
      entityObj.angles[1] = angles[1] || 0;
      entityObj.angles[2] = angles[2] || 0;
    }
    
    return true;
  }
  
  // Kill player
  kill(entity: nodemod.Entity): boolean {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return false;
    entityObj.health = 0;
    return true;
  }
  
  // Kick player
  kick(entity: nodemod.Entity, reason: string = 'Kicked by admin'): boolean {
    const id = this.util.forceEntityId(entity);
    if (id === null) return false;
    nodemod.eng.serverCommand(`kick #${id} "${reason}"\n`);
    return true;
  }
  
  // Ban player (requires external ban system)
  ban(entity: nodemod.Entity, duration: number = 0, reason: string = 'Banned by admin'): { steamId: string; duration: number; reason: string } | null {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return null;
    const steamId = nodemod.eng.getPlayerAuthId(entityObj);
    const durationText = duration > 0 ? ` for ${duration} minutes` : ' permanently';
    
    // This would need integration with a ban system
    this.kick(entity, `Banned${durationText}: ${reason}`);
    
    return { steamId, duration, reason };
  }
  
  // Set player properties
  setHealth(entity: nodemod.Entity, health: number): number {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return 0;
    entityObj.health = Math.max(0, health);
    return entityObj.health;
  }
  
  setArmor(entity: nodemod.Entity, armor: number): number {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return 0;
    entityObj.armorvalue = Math.max(0, armor);
    return entityObj.armorvalue;
  }
  
  setFrags(entity: nodemod.Entity, frags: number): number {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return 0;
    entityObj.frags = frags;
    return entityObj.frags;
  }
  
  // Set player speed
  setMaxSpeed(entity: nodemod.Entity, speed: number): void {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return;
    nodemod.eng.setClientMaxspeed(entityObj, speed);
  }
  
  // Get player distance
  getDistance(entity1: nodemod.Entity, entity2: nodemod.Entity): number {
    const e1 = this.util.forceEntityObject(entity1);
    const e2 = this.util.forceEntityObject(entity2);
    
    if (!e1 || !e2) return -1;
    
    const dx = e1.origin[0] - e2.origin[0];
    const dy = e1.origin[1] - e2.origin[1];
    const dz = e1.origin[2] - e2.origin[2];
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  // Check if player can see another entity
  canSee(entity: nodemod.Entity, target: nodemod.Entity): boolean {
    const entityObj = this.util.forceEntityObject(entity);
    const targetObj = this.util.forceEntityObject(target);
    
    if (!entityObj || !targetObj) return false;
    
    const trace = {} as nodemod.TraceResult;
    let x = nodemod.eng.traceLine(
      [entityObj.origin[0], entityObj.origin[1], entityObj.origin[2] + entityObj.view_ofs[2]],
      [targetObj.origin[0], targetObj.origin[1], targetObj.origin[2] + 16],
      0, // IGNORE_MONSTERS
      entityObj,
    );
    
    return trace.fraction >= 1.0 || trace.hit === targetObj;
  }
  
  // Player statistics
  getStats(entity: nodemod.Entity): PlayerStats | null {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return null;
    
    return {
      id: nodemod.eng.indexOfEdict(entityObj),
      name: entityObj.netname,
      frags: entityObj.frags,
      deaths: (entityObj as PlayerEntity).deaths || 0,
      health: entityObj.health,
      armor: entityObj.armorvalue,
      steamId: nodemod.eng.getPlayerAuthId(entityObj)
    };
  }
  
  // Find players by criteria
  findPlayers(criteria: Partial<PlayerInfo>): PlayerInfo[] {
    return this.getAll().filter(player => {
      for (const [key, value] of Object.entries(criteria)) {
        if (key in player && (player as any)[key] !== value) return false;
      }
      return true;
    });
  }
  
  // Get players in radius
  getPlayersInRadius(origin: number[], radius: number): PlayerInfo[] {
    return this.getAll().filter(player => {
      const dx = player.origin[0] - origin[0];
      const dy = player.origin[1] - origin[1];
      const dz = player.origin[2] - origin[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return distance <= radius;
    });
  }
  
  /**
   * Broadcasts a message to all connected players.
   * 
   * @param message - Message text to broadcast
   * @param type - Message display type ('chat', 'hud', 'console', 'center')
   * 
   * @example
   * ```typescript
   * // Broadcast to all players
   * nodemodCore.player.broadcast('Server restarting in 5 minutes!', 'center');
   * 
   * // Chat message to all
   * nodemodCore.player.broadcast('Welcome to the server!', 'chat');
   * 
   * // HUD message for all
   * nodemodCore.player.broadcast('Round: 3/10', 'hud');
   * ```
   */
  broadcast(message: string, type: string = 'chat'): void {
    this.getAll().forEach(player => {
      this.sendMessage(player.entity, message, type);
    });
  }
  
  /**
   * Creates a fake client (bot player) for testing or gameplay purposes.
   * 
   * @param name - Name for the bot player
   * @returns PlayerInfo object for the created bot, or null if creation failed
   * 
   * @example
   * ```typescript
   * // Create a basic bot
   * const bot = nodemodCore.player.createBot('TestBot');
   * if (bot) {
   *   console.log(`Created bot: ${bot.name}`);
   *   bot.teleport([0, 0, 0]);
   * }
   * 
   * // Create named bots
   * const bots = ['Bot1', 'Bot2', 'Bot3'].map(name => 
   *   nodemodCore.player.createBot(name)
   * ).filter(bot => bot !== null);
   * ```
   */
  createBot(name: string = 'Bot'): PlayerInfo | null {
    const entity = nodemod.eng.createFakeClient(name);
    return entity ? this.getPlayerInfo(entity) : null;
  }
}
