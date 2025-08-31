// Core modules - Original specialized functionality
import NodemodCmd from './core/cmd';
import NodemodMenu from './core/menu';
import NodemodMsg from './core/msg';
import NodemodResource from './core/resource';
import NodemodSound from './core/sound';

// Native modules - Direct nodemod API wrappers
import NodemodCVar from './native/cvar';
import NodemodFile from './native/file';

// Enhanced modules - Build upon core/native functionality
import NodemodEvents from './enhanced/events';
import NodemodPlayer from './enhanced/player';
import NodemodEntity from './enhanced/entity';
import NodemodTrace from './enhanced/trace';

// Utility modules - Helper functions
import NodemodUtil from './utils/util';

/**
 * Main NodeMod Core class providing unified access to all NodeMod services
 * 
 * This class serves as the central hub for all NodeMod functionality, providing
 * easy access to various services including messaging, entity management, 
 * player utilities, and Half-Life engine interactions.
 * 
 * @example
 * ```typescript
 * // Access the global nodemodCore instance
 * nodemodCore.util.messageAll("Hello world!");
 * nodemodCore.player.getAll().forEach(player => {
 *   console.log(`Player: ${player.name}`);
 * });
 * ```
 */
class NodemodCore {
  /** Console variable management service */
  public readonly cvar: NodemodCVar;
  
  /** File system operations service */
  public readonly file: NodemodFile;
  
  /** Network messaging service */
  public readonly msg: NodemodMsg;
  
  /** General utility functions */
  public readonly util: NodemodUtil;
  
  /** Sound management service */
  public readonly sound: NodemodSound;
  
  /** Command registration and handling service */
  public readonly cmd: NodemodCmd;
  
  /** Resource management service */
  public readonly resource: NodemodResource;
  
  /** Menu creation and display service */
  public readonly menu: NodemodMenu;
  
  /** Event handling service */
  public readonly events: NodemodEvents;
  
  /** Player management and utilities */
  public readonly player: NodemodPlayer;
  
  /** Entity management and utilities */
  public readonly entity: NodemodEntity;
  
  /** Trace and collision detection service */
  public readonly trace: NodemodTrace;

  // Direct access to nodemod properties for power developers
  
  /** Current working directory of the game server */
  get cwd(): string { return nodemod.cwd; }
  
  /** Current map name */
  get mapname(): string { return nodemod.mapname; }
  
  /** Current server time */
  get time(): number { return nodemod.time; }
  
  /** Array of all connected player entities */
  get players(): nodemod.Entity[] { return nodemod.players; }

  // Utility functions
  
  /**
   * Get the message ID for a user message name
   * @param msgName The name of the user message
   * @returns The message ID
   */
  getUserMsgId(msgName: string): number { return nodemod.getUserMsgId(msgName); }
  
  /**
   * Get the message name for a user message ID
   * @param msgId The message ID
   * @returns The message name
   */
  getUserMsgName(msgId: number): string { return nodemod.getUserMsgName(msgId); }
  
  /**
   * Set the metamod result for the current hook
   * @param result The metamod result constant
   */
  setMetaResult(result: nodemod.META_RES): void { return nodemod.setMetaResult(result); }
  
  /**
   * Continue server execution (used with metamod hooks)
   */
  continueServer(): void { return nodemod.continueServer(); }

  constructor() {
    // Initialize native services (no dependencies)
    this.cvar = new NodemodCVar();
    this.file = new NodemodFile();

    // Initialize msg service (self-contained)
    this.msg = new NodemodMsg();
    
    // Initialize util service with msg dependency
    this.util = new NodemodUtil(this.msg);
    
    // Now that util is ready, inject it back into msg for entity conversion
    this.msg.setUtilService(this.util);
    
    // Initialize remaining services with dependencies
    this.sound = new NodemodSound(this.util);
    this.cmd = new NodemodCmd();
    this.resource = new NodemodResource();
    this.menu = new NodemodMenu(this.msg, this.util);
    this.events = new NodemodEvents();
    this.player = new NodemodPlayer(this.util, this.msg, this.sound);
    this.entity = new NodemodEntity(this.util);
    this.trace = new NodemodTrace();
  }
}

const nodemodCore = new NodemodCore();

// ES Module default export for modern imports
export default nodemodCore;

// CommonJS export for backward compatibility
module.exports = nodemodCore;
