/**
 * Handler function for menu item actions.
 */
export interface MenuHandler {
  (client: nodemod.Entity, menu?: Menu): void | Promise<void>;
}

/**
 * Configuration for a single menu item.
 */
export interface MenuItem {
  /** Display name of the menu item */
  name: string;
  /** Handler function to execute when item is selected */
  handler?: MenuHandler;
  /** Submenu to navigate to when item is selected */
  submenu?: Menu;
  /** Whether this item is disabled and cannot be selected */
  disabled?: boolean;
}

/**
 * Configuration options for creating a menu.
 */
export interface MenuOptions {
  /** Title displayed at the top of the menu */
  title: string;
  /** Array of menu items */
  items: MenuItem[];
  /** Specific entity to show menu to (if undefined, shows to all players) */
  entity?: nodemod.Entity;
  /** Auto-close timeout in seconds (-1 for no timeout) */
  time?: number;
  /** Callback when menu times out */
  onTimeout?: (client: nodemod.Entity) => void;
  /** Callback when menu is exited */
  onExit?: (client: nodemod.Entity) => void;
  /** Text for exit button */
  exitText?: string;
  /** Text for back button */
  backText?: string;
  /** Text for next page button */
  nextText?: string;
  /** Text for previous page button */
  prevText?: string;
  /** Custom formatting functions */
  formatters?: MenuFormatters;
}

/**
 * Functions for customizing menu display formatting.
 */
export interface MenuFormatters {
  /** Format the menu title */
  title?: (title: string) => string;
  /** Format individual menu items */
  item?: (item: MenuItem, index: number, isDisabled: boolean) => string;
  /** Format pagination display */
  pagination?: (current: number, total: number) => string;
  /** Format divider between title and items */
  divider?: () => string;
}

/**
 * Internal state tracking for active menus.
 */
export interface MenuState {
  /** Currently displayed menu */
  menu: Menu;
  /** Current page number (0-based) */
  currentPage: number;
  /** Navigation history for back functionality */
  history: Menu[];
  /** Whether this menu is shown to all players */
  isAll: boolean;
  /** Array of client indices that have used this menu */
  used: number[];
  /** Timeout ID for auto-close functionality */
  timeoutId?: any;
}

/**
 * Map of menu states indexed by client or 'all' for global menus.
 */
export interface MenuStateMap {
  [key: string]: MenuState;
  [key: number]: MenuState;
}

/**
 * Represents a menu that can be displayed to players with navigable items and submenus.
 * 
 * @example
 * ```typescript
 * const menu = new Menu({
 *   title: 'Player Actions',
 *   items: [
 *     {
 *       name: 'Kick Player',
 *       handler: (client) => {
 *         console.log(`${client.name} selected kick player`);
 *       }
 *     },
 *     {
 *       name: 'Ban Player',
 *       handler: (client) => {
 *         console.log(`${client.name} selected ban player`);
 *       }
 *     }
 *   ]
 * });
 * ```
 */
export class Menu {
  /** Menu title displayed at the top */
  public title: string;
  /** Array of menu items */
  public items: MenuItem[];
  /** Specific entity this menu is for (undefined = all players) */
  public entity?: nodemod.Entity;
  /** Auto-close timeout in seconds (-1 for no timeout) */
  public time: number;
  /** Callback when menu times out */
  public onTimeout?: (client: nodemod.Entity) => void;
  /** Callback when menu is exited */
  public onExit?: (client: nodemod.Entity) => void;
  /** Text for exit button */
  public exitText: string;
  /** Text for back button */
  public backText: string;
  /** Text for next page button */
  public nextText: string;
  /** Text for previous page button */
  public prevText: string;
  /** Formatting functions for menu display */
  public formatters: Required<MenuFormatters>;
  /** Parent menu for navigation hierarchy */
  public parent?: Menu;

  /**
   * Creates a new Menu instance.
   * 
   * @param options - Menu configuration options
   */
  constructor(options: MenuOptions) {
    this.title = options.title;
    this.items = options.items;
    this.entity = options.entity;
    this.time = options.time ?? -1;
    this.onTimeout = options.onTimeout;
    this.onExit = options.onExit;
    this.exitText = options.exitText ?? "Exit";
    this.backText = options.backText ?? "Back";
    this.nextText = options.nextText ?? "Next";
    this.prevText = options.prevText ?? "Previous";
    
    this.formatters = {
      title: options.formatters?.title ?? ((title: string) => `=== ${title} ===`),
      item: options.formatters?.item ?? ((item: MenuItem, index: number, isDisabled: boolean) => 
        `${index + 1}. ${isDisabled ? '[DISABLED] ' : ''}${item.name}`),
      pagination: options.formatters?.pagination ?? ((current: number, total: number) => 
        `Page ${current}/${total}`),
      divider: options.formatters?.divider ?? (() => ""),
    };

    // Set parent reference for submenus
    this.items.forEach(item => {
      if (item.submenu) {
        item.submenu.parent = this;
      }
    });
  }

  /**
   * Static template methods for creating common menu types.
   */
  static template = {
    /**
     * Creates a simple menu with string items and optional handlers.
     * 
     * @param title - Menu title
     * @param items - Array of item names
     * @param handlers - Optional array of handlers (must match items length)
     * @returns Configured Menu instance
     * 
     * @example
     * ```typescript
     * const menu = Menu.template.simple(
     *   'Choose Action',
     *   ['Option 1', 'Option 2', 'Option 3'],
     *   [(client) => console.log('Option 1'), (client) => console.log('Option 2')]
     * );
     * ```
     */
    simple: (title: string, items: string[], handlers?: MenuHandler[]): Menu => 
      new Menu({
        title,
        items: items.map((name, i) => ({ name, handler: handlers?.[i] }))
      }),

    /**
     * Creates a Yes/No confirmation menu.
     * 
     * @param title - Menu title/question
     * @param onYes - Handler for Yes selection
     * @param onNo - Handler for No selection
     * @returns Configured Menu instance
     * 
     * @example
     * ```typescript
     * const menu = Menu.template.yesNo(
     *   'Are you sure?',
     *   (client) => console.log('User confirmed'),
     *   (client) => console.log('User declined')
     * );
     * ```
     */
    yesNo: (title: string, onYes: MenuHandler, onNo: MenuHandler): Menu =>
      new Menu({
        title,
        items: [
          { name: "Yes", handler: onYes },
          { name: "No", handler: onNo }
        ]
      }),

    /**
     * Creates a confirmation menu with Confirm/Cancel options.
     * 
     * @param message - Confirmation message
     * @param onConfirm - Handler for Confirm selection
     * @param onCancel - Optional handler for Cancel selection
     * @returns Configured Menu instance
     * 
     * @example
     * ```typescript
     * const menu = Menu.template.confirm(
     *   'Delete all data?',
     *   (client) => deleteData(),
     *   (client) => console.log('Cancelled')
     * );
     * ```
     */
    confirm: (message: string, onConfirm: MenuHandler, onCancel?: MenuHandler): Menu =>
      new Menu({
        title: message,
        items: [
          { name: "Confirm", handler: onConfirm },
          { name: "Cancel", handler: onCancel || (() => {}) }
        ]
      })
  };
}

import type NodemodMsg from './msg';
import type NodemodUtil from '../utils/util';

/**
 * Menu system manager for handling interactive menus in the nodemod plugin system.
 * Supports pagination, navigation, timeouts, and both client-specific and global menus.
 * 
 * @example
 * ```typescript
 * // Show a menu to all players
 * nodemodCore.menu.show({
 *   title: 'Admin Menu',
 *   items: [
 *     { name: 'Kick Player', handler: handleKick },
 *     { name: 'Change Map', handler: handleMapChange }
 *   ]
 * });
 * 
 * // Show a menu to a specific player
 * nodemodCore.menu.show({
 *   title: 'Player Options',
 *   entity: specificPlayer,
 *   items: [
 *     { name: 'View Stats', handler: showStats }
 *   ]
 * });
 * ```
 */
export default class NodemodMenu {
  /** Map of active menu states by client index or 'all' */
  private menuStates: MenuStateMap = {};
  /** Message service for sending menu data */
  private msg: NodemodMsg;
  /** Utility service */
  private util: NodemodUtil;
  /** Maximum items per page (leaves slots for navigation) */
  private readonly ITEMS_PER_PAGE = 7; // Leave slots for navigation (8=back/exit, 9=prev, 0=next)

  /**
   * Creates a new NodemodMenu instance.
   * 
   * @param msgService - Message service for sending menu displays
   * @param utilService - Utility service
   */
  constructor(msgService: NodemodMsg, utilService: NodemodUtil) {
    this.msg = msgService;
    this.util = utilService;
    this.initializeEventHandlers();
  }

  /**
   * Initializes event handlers for menu interactions.
   */
  private initializeEventHandlers(): void {
    nodemod.on('dllClientCommand', (client: nodemod.Entity, text: string) => {
      this.handleMenuCommand(client, text);
    });
  }

  /**
   * Handles menu selection commands from clients.
   * 
   * @param client - The client entity that sent the command
   * @param text - The command text containing menu selection
   */
  private handleMenuCommand(client: nodemod.Entity, text: string): void {
    const args = text.split(' ');
    if (args[0] !== 'menuselect') {
      return;
    }

    const selection = parseInt(args[1]);
    const clientIndex = nodemod.eng.indexOfEdict(client);
    const state = this.menuStates[clientIndex] || this.menuStates['all'];
    
    if (!state) {
      return;
    }

    nodemod.setMetaResult(nodemod.META_RES.SUPERCEDE); // Supercede the command

    // Handle special navigation options
    if (selection === 0 || selection === 10) { // Exit (0 key sends 10)
      this.handleBackExit(client, state);
      return;
    }

    if (selection === 8) { // Previous page
      this.handlePrevPage(client, state);
      return;
    }

    if (selection === 9) { // Next page
      this.handleNextPage(client, state);
      return;
    }

    // Handle regular menu item selection
    this.handleItemSelection(client, state, selection);
  }

  private handleBackExit(client: nodemod.Entity, state: MenuState): void {
    if (state.history.length > 0) {
      // Go back to previous menu
      const previousMenu = state.history.pop()!;
      this.showMenuInternal(previousMenu, client, state, 0);
    } else {
      // Exit menu
      this.cleanupMenuState(client, state);
      state.menu.onExit?.(client);
    }
  }

  private handlePrevPage(client: nodemod.Entity, state: MenuState): void {
    if (state.currentPage > 0) {
      state.currentPage--;
      this.showMenuInternal(state.menu, client, state, state.currentPage);
    }
  }

  private handleNextPage(client: nodemod.Entity, state: MenuState): void {
    const totalPages = Math.ceil(state.menu.items.length / this.ITEMS_PER_PAGE);
    if (state.currentPage < totalPages - 1) {
      state.currentPage++;
      this.showMenuInternal(state.menu, client, state, state.currentPage);
    }
  }

  private handleItemSelection(client: nodemod.Entity, state: MenuState, selection: number): void {
    const itemIndex = (state.currentPage * this.ITEMS_PER_PAGE) + (selection - 1);
    const item = state.menu.items[itemIndex];

    if (!item || item.disabled) {
      return;
    }

    if (item.submenu) {
      // Navigate to submenu
      state.history.push(state.menu);
      this.showMenuInternal(item.submenu, client, state, 0);
    } else if (item.handler) {
      // Execute handler
      state.used.push(nodemod.eng.indexOfEdict(client));
      
      try {
        const result = item.handler(client, state.menu);
        if (result instanceof Promise) {
          result.catch(error => console.error('Menu handler error:', error));
        }
      } catch (error) {
        console.error('Menu handler error:', error);
      }

      // Clean up single-client menus
      if (!state.isAll) {
        this.cleanupMenuState(client, state);
      }
    }
  }

  private cleanupMenuState(client: nodemod.Entity, state: MenuState): void {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }
    
    const clientIndex = nodemod.eng.indexOfEdict(client);
    if (state.isAll) {
      delete this.menuStates['all'];
    } else {
      delete this.menuStates[clientIndex];
    }
  }

  /**
   * Displays a menu to players. Can show to all players or a specific entity.
   * 
   * @param options - Menu configuration or Menu instance
   * 
   * @example
   * ```typescript
   * // Show to all players
   * nodemodCore.menu.show({
   *   title: 'Server Menu',
   *   items: [
   *     { name: 'Option 1', handler: (client) => console.log('Selected 1') }
   *   ]
   * });
   * 
   * // Show to specific player
   * nodemodCore.menu.show({
   *   title: 'Personal Menu',
   *   entity: player,
   *   time: 30, // Auto-close after 30 seconds
   *   items: [
   *     { name: 'View Profile', handler: showProfile }
   *   ]
   * });
   * ```
   */
  show(options: MenuOptions | Menu): void {
    const menu = options instanceof Menu ? options : new Menu(options);
    const clients = menu.entity ? [menu.entity] : nodemod.players;

    clients.forEach(client => {
      const clientIndex = nodemod.eng.indexOfEdict(client);
      const state: MenuState = {
        menu,
        currentPage: 0,
        history: [],
        isAll: !menu.entity,
        used: []
      };

      this.menuStates[menu.entity ? clientIndex : 'all'] = state;
      this.showMenuInternal(menu, client, state, 0);
    });
  }

  private showMenuInternal(menu: Menu, client: nodemod.Entity, state: MenuState, page: number): void {
    state.currentPage = page;
    state.menu = menu;

    // Clear existing timeout
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }

    // Set timeout if specified
    if (menu.time > 0) {
      state.timeoutId = setTimeout(() => {
        menu.onTimeout?.(client);
        this.cleanupMenuState(client, state);
      }, menu.time * 1000);
    }

    const { menuText, keyMask } = this.buildMenuDisplay(menu, page);

    this.msg.send({
      type: 'ShowMenu',
      entity: client,
      data: [
        { type: 'short', value: keyMask },
        { type: 'char', value: menu.time },
        { type: 'byte', value: false },
        { type: 'string', value: menuText }
      ]
    });
  }

  private buildMenuDisplay(menu: Menu, page: number): { menuText: string, keyMask: number } {
    const startIndex = page * this.ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + this.ITEMS_PER_PAGE, menu.items.length);
    const pageItems = menu.items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(menu.items.length / this.ITEMS_PER_PAGE);

    let menuText = menu.formatters.title(menu.title);
    
    if (menu.formatters.divider().length > 0) {
      menuText += '\n' + menu.formatters.divider();
    }

    if (totalPages > 1) {
      menuText += '\n' + menu.formatters.pagination(page + 1, totalPages);
    }

    menuText += '\n';

    let keyMask = 0;

    // Add menu items
    pageItems.forEach((item, index) => {
      const actualIndex = startIndex + index;
      const displayNumber = index + 1; // Always 1-7 for display
      
      if (!item.disabled && (item.handler || item.submenu)) {
        keyMask |= (1 << (displayNumber - 1));
      }

      // Pass display number (1-7) instead of actual index for formatting
      menuText += '\n' + menu.formatters.item(item, index, item.disabled || false);
    });

    // Add navigation options
    menuText += '\n';
    
    // Previous page (key 8)
    if (page > 0) {
      menuText += `\n8. ${menu.prevText}`;
      keyMask |= (1 << 7); // Enable key 8
    }

    // Next page (key 9)
    if (page < totalPages - 1) {
      menuText += `\n9. ${menu.nextText}`;
      keyMask |= (1 << 8); // Enable key 9
    }
    
    // Exit option (key 0)
    const hasHistory = menu.parent !== undefined;
    menuText += `\n0. ${hasHistory ? menu.backText : menu.exitText}`;
    keyMask |= (1 << 9); // Enable key 0

    return { menuText, keyMask };
  }

  /**
   * Closes the menu for a specific client.
   * 
   * @param client - The client to close the menu for
   */
  closeMenu(client: nodemod.Entity): void {
    const clientIndex = nodemod.eng.indexOfEdict(client);
    const state = this.menuStates[clientIndex] || this.menuStates['all'];
    if (state) {
      this.cleanupMenuState(client, state);
    }
  }

  /**
   * Closes all active menus and clears all menu states.
   */
  closeAllMenus(): void {
    Object.keys(this.menuStates).forEach(key => {
      const state = this.menuStates[key];
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
    });
    this.menuStates = {};
  }

  /** Export Menu class for external use */
  static Menu = Menu;
}
