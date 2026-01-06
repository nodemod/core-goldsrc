import { EventEmitter } from 'events';
import type NodemodUtil from '../utils/util';

/**
 * Represents a single piece of message data with its type and value.
 */
export interface MessageData {
  /** The data type for network serialization */
  type: 'byte' | 'char' | 'short' | 'long' | 'angle' | 'coord' | 'string' | 'entity';
  /** The actual value to be sent */
  value: any;
}

/**
 * Internal state tracking for message processing.
 */
export interface MessageState {
  /** Message destination flags */
  dest: number;
  /** Message type ID */
  type: number;
  /** Message name/identifier */
  name: string;
  /** 3D origin coordinates */
  origin: number[];
  /** Target entity (if applicable) */
  entity?: nodemod.Entity | null;
  /** Processed data array */
  data: any[];
  /** Raw message data with type information */
  rawData: MessageData[];
  /** Flag indicating message processing is complete */
  isMessageEnd?: boolean;
}

/**
 * Options for sending a message to clients.
 */
export interface SendOptions {
  /** Message type name or numeric ID */
  type: string | number;
  /** Message destination (defaults based on entity presence) */
  dest?: number;
  /** Target entity, entity index, or null for broadcasts */
  entity?: nodemod.Entity | number | null;
  /** 3D origin coordinates for positional messages */
  origin?: number[];
  /** Array of message data to send */
  data: MessageData[];
}

// Extend the nodemod namespace to include missing methods
// Beautiful dependency injection for util service

/**
 * Message destination constants for targeting different groups of clients.
 */
export const MsgDest = {
  /** Message to all players without delivery guarantee */
  broadcast: 0,
  /** Message to one player with delivery guarantee */
  one: 1,
  /** Message with delivery guarantee to all players */
  all: 2,
  /** Write to the init string */
  init: 3,
  /** All players in potentially visible set of point */
  pvs: 4,
  /** All players in potentially audible set */
  pas: 5,
  /** All players in PVS with reliable delivery */
  pvs_r: 6,
  /** All players in PAS with reliable delivery */
  pas_r: 7,
  /** Message to one player without delivery guarantee */
  one_unreliable: 8,
  /** Message to all HLTV proxy */
  spec: 9
}

/**
 * Engine message type constants for different types of network messages.
 */
export const MsgTypes = {
  /** Invalid message type */
  bad: 0,
  /** No operation */
  nop: 1,
  /** Client disconnect message */
  disconnect: 2,
  /** Event message */
  event: 3,
  /** Version information */
  version: 4,
  /** Set client view */
  setview: 5,
  /** Sound message */
  sound: 6,
  /** Time synchronization */
  time: 7,
  /** Print message to console */
  print: 8,
  /** Send command to client */
  stufftext: 9,
  /** Set client view angle */
  setangle: 10,
  /** Server information */
  serverinfo: 11,
  /** Light style update */
  lightstyle: 12,
  /** Update user information */
  updateuserinfo: 13,
  /** Delta description */
  deltadescription: 14,
  /** Client data update */
  clientdata: 15,
  /** Stop sound */
  stopsound: 16,
  /** Ping information */
  pings: 17,
  /** Particle effect */
  particle: 18,
  /** Damage indicator */
  damage: 19,
  /** Spawn static entity */
  spawnstatic: 20,
  /** Reliable event */
  event_reliable: 21,
  /** Spawn baseline */
  spawnbaseline: 22,
  /** Temporary entity */
  tempentity: 23,
  /** Set game pause state */
  setpause: 24,
  /** Sign-on number */
  signonnum: 25,
  /** Center print message */
  centerprint: 26,
  /** Monster killed notification */
  killedmonster: 27,
  /** Secret found notification */
  foundsecret: 28,
  /** Spawn static sound */
  spawnstaticsound: 29,
  /** Intermission state */
  intermission: 30,
  /** Finale message */
  finale: 31,
  /** CD track change */
  cdtrack: 32,
  /** Game state restore */
  restore: 33,
  /** Cutscene message */
  cutscene: 34,
  /** Weapon animation */
  weaponanim: 35,
  /** Decal name */
  decalname: 36,
  /** Room type for audio */
  roomtype: 37,
  /** Add to view angle */
  addangle: 38,
  /** New user message registration */
  newusermsg: 39,
  /** Packet entities */
  packetentities: 40,
  /** Delta packet entities */
  deltapacketentities: 41,
  /** Network choke */
  choke: 42,
  /** Resource list */
  resourcelist: 43,
  /** New movement variables */
  newmovevars: 44,
  /** Resource request */
  resourcerequest: 45,
  /** Client customization */
  customization: 46,
  /** Crosshair angle */
  crosshairangle: 47,
  /** Sound fade */
  soundfade: 48,
  /** File transfer failed */
  filetxferfailed: 49,
  /** HLTV message */
  hltv: 50,
  /** Director message */
  director: 51,
  /** Voice initialization */
  voiceinit: 52,
  /** Voice data */
  voicedata: 53,
  /** Send extra info */
  sendextrainfo: 54,
  /** Time scale */
  timescale: 55,
  /** Resource location */
  resourcelocation: 56,
  /** Send CVAR value */
  sendcvarvalue: 57,
  /** Send CVAR value (v2) */
  sendcvarvalue2: 58
}

/**
 * Message system for handling network communication between server and clients.
 * Provides an event-driven interface for intercepting and sending game messages.
 * 
 * @example
 * ```typescript
 * // Listen for a specific message
 * nodemodCore.msg.on('ShowMenu', (state) => {
 *   console.log('Menu message intercepted:', state);
 * });
 * 
 * // Send a message to all clients
 * nodemodCore.msg.send({
 *   type: 'TextMsg',
 *   data: [
 *     { type: 'byte', value: 4 }, // HUD_PRINTCENTER
 *     { type: 'string', value: 'Welcome to the server!' }
 *   ]
 * });
 * 
 * // Send a message to specific player
 * nodemodCore.msg.send({
 *   type: 'ShowMenu',
 *   entity: player,
 *   data: [
 *     { type: 'short', value: 1023 },
 *     { type: 'char', value: 30 },
 *     { type: 'byte', value: false },
 *     { type: 'string', value: 'Menu text here' }
 *   ]
 * });
 * ```
 */
export default class NodemodMsg extends EventEmitter {
  /** Utility service for entity operations */
  private util: NodemodUtil | null;
  /** Current message processing state */
  private state: MessageState | null;
  /** Map of registered user message types */
  private registeredEventTypes: { [key: string]: string };

  /**
   * Creates a new NodemodMsg instance.
   * 
   * @param utilService - Optional utility service (can be injected later)
   */
  constructor(utilService: NodemodUtil | null = null) {
    super();
    this.util = utilService; // Will be null initially, injected later
    this.state = null;
    this.registeredEventTypes = {};
    try {
      this.initializeEventHandlers();
    } catch (error) {
      // Ignore errors if nodemod is not available (outside HLDS environment)
    }
  }

  /**
   * Sets the utility service after construction.
   * Used for dependency injection when service isn't available during construction.
   * 
   * @param utilService - The utility service instance
   */
  setUtilService(utilService: NodemodUtil): void {
    this.util = utilService;
  }

  private initializeEventHandlers(): void {
    this.on('newListener', (eventName: string) => this.getUserMsgId(eventName.replace(/^post:/, '')));

    nodemod.on('engMessageBegin', (msg_dest: number, msg_type: number, origin: number[], entity: nodemod.Entity | null) => {
      const name = nodemod.getUserMsgName(msg_type);
      if (!this.listeners(name).length && !this.listeners(`post:${name}`).length) {
        return;
      }

      this.state = { dest: msg_dest, type: msg_type, name, origin, entity, data: [], rawData: [] };
    });

    // POST because programmer might want to send a new message immediately from notification
    nodemod.on('engMessageEnd', () => {
      if (!this.state) {
        return;
      }

      const state = this.state;
      this.emit(state.name, state);

      this.state.isMessageEnd = true; // so that write methods are not called repeatedly
      this.state.rawData.map(v => this.writers[v.type](v.value));
      this.state.data = this.state.rawData.map(v => v.value);
    });

    nodemod.on('postEngMessageEnd', () => {
      if (!this.state) {
        return;
      }

      const state = this.state;
      this.state = null;

      this.emit(`post:${state.name}`, state);
    });

    nodemod.on('engWriteByte', (v: number) => this.writeValue(v || 0, 'byte'));
    nodemod.on('engWriteChar', (v: number) => this.writeValue(v || 0, 'char'));
    nodemod.on('engWriteShort', (v: number) => this.writeValue(v || 0, 'short'));
    nodemod.on('engWriteLong', (v: number) => this.writeValue(v || 0, 'long'));
    nodemod.on('engWriteAngle', (v: number) => this.writeValue(v || 0, 'angle'));
    nodemod.on('engWriteCoord', (v: number) => this.writeValue(v || 0, 'coord'));
    nodemod.on('engWriteString', (v: string) => this.writeValue(v || '', 'string'));
    nodemod.on('engWriteEntity', (v: nodemod.Entity | number) => this.writeValue(v, 'entity'));
  }

  private writers: { [key: string]: (value: any) => void } = {
    byte: (v: number) => nodemod.eng.writeByte(v),
    char: (v: number) => nodemod.eng.writeChar(v),
    short: (v: number) => nodemod.eng.writeShort(v),
    long: (v: number) => nodemod.eng.writeLong(v),
    angle: (v: number) => nodemod.eng.writeAngle(v),
    coord: (v: number) => nodemod.eng.writeCoord(v),
    string: (v: string) => nodemod.eng.writeString(v || ''),
    entity: (v: nodemod.Entity | number) => nodemod.eng.writeEntity(typeof v === 'number' ? v : nodemod.eng.indexOfEdict(v)),
  };

  private writeValue(value: any, type: MessageData['type']): void {
    if (!this.state || this.state.isMessageEnd) {
      // Don't set meta result - let C++ default MRES_IGNORED stand 
      return;
    }

    this.state.data.push(value);
    this.state.rawData.push({ type, value });
    nodemod.setMetaResult(nodemod.MRES.SUPERCEDE);
  }

  /**
   * Registers a new user message type with the engine.
   * 
   * @param eventName - Name of the message type
   * @param size - Maximum size of the message (-1 for variable size)
   * @returns Message type ID, or MsgTypes.bad if registration failed
   */
  register(eventName: string, size: number = -1): number {
    const eventId = nodemod.getUserMsgId(eventName) ?? nodemod.eng.regUserMsg(eventName, size);
    if (eventId === MsgTypes.bad) {
      // Doesn't seem to be registered still.
      return eventId;
    }
    this.registeredEventTypes[eventId.toString()] = eventName;

    return eventId;
  }

  /**
   * Gets the message ID for a user message, registering it if necessary.
   * 
   * @param name - Message name
   * @param size - Message size (-1 for variable)
   * @returns Message ID
   */
  getUserMsgId(name: string, size: number = -1): number {
    const entry = Object.entries(this.registeredEventTypes).find(v => v[1] === name);
    return entry ? parseInt(entry[0]) : this.register(name, size);
  }

  /**
   * Sends a message to clients.
   * 
   * @param options - Message sending options
   * 
   * @example
   * ```typescript
   * // Send text message to all clients
   * nodemodCore.msg.send({
   *   type: 'TextMsg',
   *   dest: MsgDest.all,
   *   data: [
   *     { type: 'byte', value: 4 }, // HUD_PRINTCENTER
   *     { type: 'string', value: 'Server announcement!' }
   *   ]
   * });
   * 
   * // Send menu to specific player
   * nodemodCore.msg.send({
   *   type: 'ShowMenu',
   *   entity: player,
   *   data: [
   *     { type: 'short', value: 511 }, // key mask
   *     { type: 'char', value: 30 },   // display time
   *     { type: 'byte', value: false }, // multi-part
   *     { type: 'string', value: '1. Option 1\n2. Option 2' }
   *   ]
   * });
   * ```
   */
  send(options: SendOptions): void {

    if (options.type === MsgTypes.bad) {
      console.error(`[NodemodMsg] Invalid message type 'bad' specified`);
      return;
    }
    const dest = options.dest ?? (options.entity ? MsgDest.one : MsgDest.all);
    
    let finalEntity: nodemod.Entity | null = null;
    
    // For broadcast destinations, always use null
    const broadcastDestinations = [MsgDest.broadcast, MsgDest.all, MsgDest.init, MsgDest.pvs, MsgDest.pas, MsgDest.pvs_r, MsgDest.pas_r, MsgDest.spec];
    
    if (broadcastDestinations.includes(dest)) {
      finalEntity = null;
    } else {
      // For targeted messages, convert entity properly
      if (options.entity) {
        if (this.util) {
          finalEntity = this.util.forceEntityObject(options.entity) || nodemod.eng.pEntityOfEntIndex(0);
        } else if (typeof options.entity === 'number') {
          finalEntity = nodemod.eng.pEntityOfEntIndex(options.entity);
        } else {
          finalEntity = options.entity;
        }
      } else {
        finalEntity = nodemod.eng.pEntityOfEntIndex(0);
      }
    }

    let type = typeof options.type === 'string' ? this.getUserMsgId(options.type) : options.type;
    if (type === MsgTypes.bad) {
      console.error(`[NodemodMsg] Failed to send message, unknown type '${options.type}'`);
      return;
    }

    nodemod.eng.messageBegin(
      dest,
      type,
      options.origin || [0, 0, 0],
      finalEntity
    );

    options.data.map(v => this.writers[v.type](v.value));
    nodemod.eng.messageEnd();
  }
}
