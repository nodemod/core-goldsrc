import { MessageData, MsgDest, MsgTypes } from '../core/msg';
import type NodemodMsg from '../core/msg';

/**
 * Configuration options for HUD text display.
 */
export interface HudTextOptions {
  /** Message channel (-1 for default, 0-3 for custom channels) */
  channel?: number;
  /** X coordinate on screen (default: 4000 - screen center) */
  x?: number;
  /** Y coordinate on screen (default: 4000 - screen center) */
  y?: number;
  /** Visual effect type */
  effect?: number;
  /** Red color component (0-255) */
  r1?: number;
  /** Green color component (0-255) */
  g1?: number;
  /** Blue color component (0-255) */
  b1?: number;
  /** Alpha (transparency) component (0-255) */
  a1?: number;
  /** Secondary red color component (0-255) */
  r2?: number;
  /** Secondary green color component (0-255) */
  g2?: number;
  /** Secondary blue color component (0-255) */
  b2?: number;
  /** Secondary alpha component (0-255) */
  a2?: number;
  /** Fade-in time in milliseconds (default: 100) */
  fadeinTime?: number;
  /** Fade-out time in milliseconds (default: 100) */
  fadeoutTime?: number;
  /** Hold time in milliseconds (default: 800) */
  holdTime?: number;
  /** Effect duration time in milliseconds (for effect type 2) */
  fxTime?: number;
}

/**
 * Comprehensive utility class providing helper functions for entity management, player communication,
 * and low-level entity data manipulation. Includes automatic player connection tracking and various
 * convenience methods for common server operations.
 * 
 * @example
 * ```typescript
 * // Send chat message to player
 * const player = nodemod.players[0];
 * nodemodCore.util.sendChat('Welcome to the server!', player);
 * 
 * // Show HUD text with custom styling
 * nodemodCore.util.showHudText(player, 'Health: 100', {
 *   x: 100, y: 200, r: 255, g: 0, b: 0
 * });
 * 
 * // Get player connection info
 * const playerInfo = nodemodCore.util.getConnectedPlayersInfo();
 * playerInfo.forEach(info => {
 *   console.log(`${info.name} (${info.steamId}) from ${info.ipAddress}`);
 * });
 * 
 * // Debug entity data
 * nodemodCore.util.dumpOffsets(player, 1000);
 * ```
 */
export default class NodemodUtil {
  /** Message service for network communication */
  private msg: NodemodMsg;
  /** Map storing player IP addresses by entity index */
  private playerIpMap = new Map<number, string>(); // entityIndex -> IP address

  /**
   * Creates a new NodemodUtil instance.
   * Automatically sets up player connection tracking.
   * 
   * @param msgService - Message service for network communication
   */
  constructor(msgService: NodemodMsg) {
    this.msg = msgService;
    this.setupPlayerTracking();
  }

  private setupPlayerTracking(): void {
    // Track player connections to store IP addresses
    nodemod.on('dllClientConnect', (entity: nodemod.Entity, name: string, address: string, rejectReason: string) => {
      const entityIndex = nodemod.eng.indexOfEdict(entity);
      this.playerIpMap.set(entityIndex, address);
    });

    // Clean up when players disconnect
    nodemod.on('dllClientDisconnect', (entity: nodemod.Entity) => {
      const entityIndex = nodemod.eng.indexOfEdict(entity);
      this.playerIpMap.delete(entityIndex);
    });
  }

  /**
   * Converts an entity reference to its numeric index.
   * Handles both entity objects and numeric indices safely.
   * 
   * @param entity - Entity object, numeric index, or null
   * @returns Entity index number or null if invalid
   * 
   * @example
   * ```typescript
   * const player = nodemod.players[0];
   * const playerId = nodemodCore.util.forceEntityId(player);
   * console.log(`Player ID: ${playerId}`);
   * ```
   */
  forceEntityId(entity: nodemod.Entity | number | null): number | null {
    if (!entity) {
      return null;
    }

    return typeof entity === 'number' ? entity : nodemod.eng.indexOfEdict(entity);
  }

  /**
   * Converts an entity reference to an entity object.
   * Handles both entity objects and numeric indices safely.
   * 
   * @param entity - Entity object, numeric index, or null
   * @returns Entity object or null if invalid
   * 
   * @example
   * ```typescript
   * const entityObj = nodemodCore.util.forceEntityObject(1);
   * if (entityObj) {
   *   console.log(`Entity name: ${entityObj.netname}`);
   * }
   * ```
   */
  forceEntityObject(entity?: nodemod.Entity | number | null): nodemod.Entity | null {
    if (!entity) {
      return null;
    }

    return typeof entity === 'number' ? nodemod.eng.pEntityOfEntIndex(entity) : entity;
  }

  /**
   * Sends a chat message to a specific player or all players.
   * Automatically handles multi-line messages by splitting on newlines.
   * 
   * @param message - Message text to send (supports newlines)
   * @param target - Target player entity/index, or null for all players
   * 
   * @example
   * ```typescript
   * // Send to specific player
   * const player = nodemod.players[0];
   * nodemodCore.util.sendChat('Welcome back!', player);
   * 
   * // Send multi-line message
   * nodemodCore.util.sendChat('Line 1\\nLine 2\\nLine 3', player);
   * 
   * // Broadcast to all players
   * nodemodCore.util.sendChat('Server announcement', null);
   * ```
   */
  sendChat(message: string, target: nodemod.Entity | number | null): void {
    message.split('\n').forEach(value => {
      if (value.trim()) { // Only send non-empty lines
        this.msg.send({
          entity: target,
          type: 'SayText',
          data: [
            { type: 'byte', value: 0 },
            { type: 'string', value: value + '\n' } // Ensure each message ends with \n
          ]
        });
      }
    });
  }

  /**
   * Displays HUD text to one or more players with optional styling.
   * Supports both simple text display and advanced positioned text with colors.
   * 
   * @param entity - Target entity, array of entities, or entity index
   * @param text - Text to display on the HUD
   * @param options - Optional positioning and color settings
   * 
   * @example
   * ```typescript
   * // Simple HUD message
   * nodemodCore.util.showHudText(player, 'Health: 100');
   * 
   * // Styled HUD message at specific position
   * nodemodCore.util.showHudText(player, 'LOW HEALTH!', {
   *   x: 100, y: 300, r: 255, g: 0, b: 0
   * });
   * 
   * // Show to multiple players
   * nodemodCore.util.showHudText([player1, player2], 'Round starts soon');
   * ```
   */
  showHudText(entity: nodemod.Entity | nodemod.Entity[] | number, text: string, options?: HudTextOptions | null): void {
    if (Array.isArray(entity)) {
      entity.forEach(v => this.showHudText(v, text, options || null));
      return;
    }

    if (options) {
      let data: MessageData[] = [
        { type: 'byte', value: 29 },
        { type: 'byte', value: options.channel ?? -1 }, // channel
        { type: 'short', value: options.x ?? 0.0 },
        { type: 'short', value: options.y ?? 0.0 },
        { type: 'byte', value: options.effect ?? 0 },
        { type: 'byte', value: options.r1 ?? 0 },
        { type: 'byte', value: options.g1 ?? 0 },
        { type: 'byte', value: options.b1 ?? 0 },
        { type: 'byte', value: options.a1 ?? 0 }, // a
        { type: 'byte', value: options.r2 ?? 255 },
        { type: 'byte', value: options.g2 ?? 255 },
        { type: 'byte', value: options.b2 ?? 255 },
        { type: 'byte', value: options.a2 ?? 255 },
        { type: 'short', value: options.fadeinTime ?? 100.0 }, // fadein
        { type: 'short', value: options.fadeoutTime ?? 100.0 }, // fadeout
        { type: 'short', value: options.holdTime ?? 800.0 }, // hold
      ];

      if (options.effect === 2) {
        data.push({ type: 'short', value: options.fxTime }); // fxtime
      }

      data.push({ type: 'string', value: text });

      this.msg.send({
        type: MsgTypes.tempentity,
        dest: entity ? MsgDest.one_unreliable : MsgDest.broadcast,
        entity: entity || null,
        data
      });

      return;
    }

    this.msg.send({
      type: 'HudText',
      data: [{ type: 'string', value: text }],
      entity: entity || null
    });
  }

  rainbowizeString(text: string): string {
    return text.split('').map(v => `^${Math.floor(Math.random() * 10)}${v}`).join('');
  }

  // Message helper methods
  messageClient(client: nodemod.Entity, message: string): void {
    this.sendChat(message + "\n", client);
  }

  messageAll(message: string): void {
    nodemod.players.forEach(player => {
      this.sendChat(message, player);
    });
  }

  // Entity validation helper
  isValidEntity(entity: nodemod.Entity): boolean {
    return !!(entity && entity.netname);
  }

  // Player info helpers
  getUserId(player: nodemod.Entity): number {
    return nodemod.eng.indexOfEdict(player);
  }

  getSteamId(player: nodemod.Entity): string {
    // Mock implementation - would need proper Steam ID extraction
    return nodemod.eng.getPlayerAuthId(player);
  }

  getIpAddress(player: nodemod.Entity): string {
    const entityIndex = nodemod.eng.indexOfEdict(player);
    return this.playerIpMap.get(entityIndex) || "Unknown";
  }

  /**
   * Gets detailed information about all connected players.
   * Includes entity references, names, IDs, and network information.
   * 
   * @returns Array of player information objects
   * 
   * @example
   * ```typescript
   * const players = nodemodCore.util.getConnectedPlayersInfo();
   * console.log(`${players.length} players connected:`);
   * 
   * players.forEach(player => {
   *   console.log(`${player.name} (${player.steamId}) from ${player.ipAddress}`);
   *   
   *   // Check if player is admin
   *   if (isAdminSteamId(player.steamId)) {
   *     nodemodCore.util.sendChat('Welcome back, admin!', player.entity);
   *   }
   * });
   * ```
   */
  getConnectedPlayersInfo(): Array<{
    entity: nodemod.Entity;
    name: string;
    userId: number;
    steamId: string;
    ipAddress: string;
  }> {
    return nodemod.players.map(player => ({
      entity: player,
      name: player.netname,
      userId: this.getUserId(player),
      steamId: this.getSteamId(player),
      ipAddress: this.getIpAddress(player)
    }));
  }

  /**
   * Clear all tracked player connection data (manual cleanup)
   * Use this to reset the IP tracking map if needed
   */
  clearPlayerTracking(): void {
    this.playerIpMap.clear();
  }

  /**
   * Read a 32-bit little-endian integer from entity private data
   * @param entity The entity to read from
   * @param offset The byte offset to read from
   * @returns The integer value or null if buffer is invalid
   */
  readInt32LE(entity: nodemod.Entity, offset: number): number | null {
    const buffer = entity.getPrivateDataBuffer(offset, 4);
    if (!buffer) return null;
    return buffer.readInt32LE(0);
  }
  
  /**
   * Write a 32-bit little-endian integer to entity private data
   * @param entity The entity to write to
   * @param offset The byte offset to write to
   * @param value The integer value to write
   */
  writeInt32LE(entity: nodemod.Entity, offset: number, value: number): void {
    const buffer = Buffer.from(new Int32Array([value]).buffer);
    entity.writePrivateDataBuffer(offset, buffer);
  }

  /**
   * Dump all non-zero private data values for an entity (debugging utility)
   * @param entity The entity to dump data for
   * @param maxOffset Maximum offset to check (default 10000)
   */
  dumpOffsets(entity: nodemod.Entity, maxOffset: number = 10000): void {
    console.log(`=== Entity Private Data Dump ===`);
    for (let byteOffset = 0; byteOffset < maxOffset; byteOffset += 4) {
      const buf = entity.getPrivateDataBuffer(byteOffset, 4);
      const val = buf?.readInt32LE(0);
      if (val !== 0) {
        const intIndex = byteOffset / 4;
        console.log(`Byte offset ${byteOffset} (int index ${intIndex}): ${val} (0x${val?.toString(16)})`);
      }
    }
    console.log(`=== End Entity Dump ===`);
  }

  /**
   * Search for specific values in entity private data (debugging utility)
   * @param entity The entity to search
   * @param searchValue The value to search for
   * @param start Starting offset (default 0)
   * @param maxOffset Maximum offset to search (default 2000)
   */
  searchOffsets(entity: nodemod.Entity, searchValue: number, start: number = 0, maxOffset: number = 2000): void {
    console.log(`=== Searching for value ${searchValue} (0x${searchValue.toString(16)}) ===`);
    for (let byteOffset = start; byteOffset < maxOffset; byteOffset += 4) {
      const buf = entity.getPrivateDataBuffer(byteOffset, 4);
      const val = buf?.readInt32LE(0);
      if (val === searchValue) {
        const intIndex = byteOffset / 4;
        console.log(`Found at byte offset ${byteOffset} (int index ${intIndex}): ${val} (0x${val?.toString(16)})`);
      }
    }
    console.log(`=== End Search ===`);
  }
}
