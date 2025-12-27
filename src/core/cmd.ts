/**
 * Context object containing information about a command execution (client or console).
 */
export interface CommandContext {
  /** The raw command text as entered by the client */
  text: string;
  /** Array of parsed command arguments, including the command name as the first element */
  args: string[];
  /** The client entity that issued the command (null for console commands) */
  client: nodemod.Entity | null;
}

/**
 * Context object containing information about a client command execution.
 */
export interface ClientCommandContext {
  /** The raw command text as entered by the client */
  text: string;
  /** Array of parsed command arguments, including the command name as the first element */
  args: string[];
  /** The client entity that issued the command */
  client: nodemod.Entity;
}

/**
 * Context object containing information about a server command execution.
 */
export interface ServerCommandContext {
  /** The raw command text as entered */
  text: string;
  /** Array of parsed command arguments, including the command name as the first element */
  args: string[];
}

/**
 * Handler function for console commands (client or server).
 */
export interface CommandHandler {
  (ctx: CommandContext): void;
}

/**
 * Handler function for client commands.
 */
export interface ClientCommandHandler {
  (ctx: ClientCommandContext): void;
}

/**
 * Handler function for server commands.
 */
export interface ServerCommandHandler {
  (ctx: ServerCommandContext): void;
}

/**
 * Configuration options for registering a command.
 */
export interface CommandOptions {
  /** The command name (without prefix) */
  name: string;
  /** Whether this is a client, server, or console command */
  type: 'console' | 'client' | 'server';
  /** The handler function to execute when the command is invoked */
  handler: CommandHandler | ClientCommandHandler | ServerCommandHandler;
}

// Extend the nodemod namespace to include missing methods

/**
 * Command manager for handling both client and server commands in the nodemod plugin system.
 * 
 * @example
 * ```typescript
 * // Register a client command
 * nodemodCore.cmd.add({
 *   name: 'hello',
 *   type: 'client',
 *   handler: (ctx) => {
 *     console.log(`Hello ${ctx.client.name}!`);
 *   }
 * });
 * 
 * // Register a server command
 * nodemodCore.cmd.add({
 *   name: 'restart',
 *   type: 'server',
 *   handler: () => {
 *     console.log('Server restarting...');
 *   }
 * });
 * ```
 */
export default class NodemodCmd {
  /** Array of registered commands */
  private commands: CommandOptions[] = [];

  /**
   * Parses a command string into an array of arguments, respecting quoted strings.
   * 
   * @param command - The raw command string to parse
   * @returns Array of parsed arguments
   * 
   * @example
   * ```typescript
   * parseCommand('say "hello world" test') // Returns: ['say', 'hello world', 'test']
   * parseCommand('kick player reason') // Returns: ['kick', 'player', 'reason']
   * ```
   */
  private parseCommand(command: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < command.length) {
      const char = command[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ' ' && !inQuotes) {
        if (current.length > 0) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
      i++;
    }
    
    // Add the last argument if there is one
    if (current.length > 0) {
      args.push(current);
    }
    
    return args;
  }

  /**
   * Creates a new NodemodCmd instance and sets up command event listeners.
   * Automatically handles client command events from the nodemod system.
   */
  constructor() {
    nodemod.on('dllClientCommand', (client: nodemod.Entity, rtext: string) => {
      const args = this.parseCommand(rtext);
      const commandName = args[0];

      const command = this.getCommand(commandName, 'client') || this.getCommand(commandName, 'console');
      if (!command) {
        return;
      }

      nodemod.setMetaResult(nodemod.META_RES.SUPERCEDE); // Supercede the command

      if (command.type === 'client') {
        const ctx: ClientCommandContext = { text: rtext, args, client };
        return (command.handler as ClientCommandHandler)(ctx);
      } else {
        const ctx: CommandContext = { text: rtext, args, client };
        return (command.handler as CommandHandler)(ctx);
      }
    });
  }

  /**
   * Retrieves a registered command by name and type.
   * 
   * @param commandName - The name of the command to find
   * @param type - The type of command ('client' or 'server')
   * @returns The command options if found, undefined otherwise
   */
  getCommand(commandName: string, type: string): CommandOptions | undefined {
    return this.commands.find(v => v.name === commandName && v.type === type);
  }

  /**
   * Adds a new command to the command registry.
   * For server commands, automatically registers them with the native engine.
   * 
   * @param options - Command configuration options
   * 
   * @example
   * ```typescript
   * // Client command
   * nodemodCore.cmd.add({
   *   name: 'info',
   *   type: 'client',
   *   handler: (ctx) => {
   *     console.log(`Player: ${ctx.client.name}, Args: ${ctx.args.join(' ')}`);
   *   }
   * });
   * 
   * // Server command
   * nodemodCore.cmd.add({
   *   name: 'status',
   *   type: 'server',
   *   handler: () => {
   *     console.log('Server is running');
   *   }
   * });
   * ```
   */
  add(options: CommandOptions): void {
    this.commands.push(options);
    
    // Register server and console commands with the engine
    if (options.type === 'server' || options.type === 'console') {
      // For console commands, we need to handle both client and server contexts
      if (options.type === 'console') {
        const consoleHandler = () => {
          try {
            const argCount = nodemod.eng.cmdArgc();
            const args: string[] = [];
            for (let i = 0; i < argCount; i++) {
              args.push(nodemod.eng.cmdArgv(i));
            }
            const text = nodemod.eng.cmdArgs();
            const ctx: CommandContext = { text, args, client: null };
            (options.handler as CommandHandler)(ctx);
          } catch (err) {
            console.error(`Error in console command '${options.name}':`, err instanceof Error ? err.stack : err);
          }
        };
        nodemod.eng.addServerCommand(options.name, consoleHandler as any);
      } else {
        // Server command - needs wrapper to build context from engine args
        const serverHandler = () => {
          try {
            const argCount = nodemod.eng.cmdArgc();
            const args: string[] = [];
            for (let i = 0; i < argCount; i++) {
              args.push(nodemod.eng.cmdArgv(i));
            }
            const text = nodemod.eng.cmdArgs();
            const ctx: ServerCommandContext = { text, args };
            (options.handler as ServerCommandHandler)(ctx);
          } catch (err) {
            console.error(`Error in server command '${options.name}':`, err instanceof Error ? err.stack : err);
          }
        };
        nodemod.eng.addServerCommand(options.name, serverHandler as any);
      }
    }
  }

  /**
   * Convenience method to register a console command that works from both client and server.
   * Similar to AMXX console commands - can be executed by clients or from server console.
   * The handler receives the client (null if from console) and arguments.
   *
   * @param name - The command name
   * @param handler - Function that receives the client entity (or null) and arguments
   *
   * @example
   * ```typescript
   * nodemodCore.cmd.register('status', (client, args) => {
   *   if (client) {
   *     console.log(`Client ${client.name} requested status`);
   *   } else {
   *     console.log('Server console requested status');
   *   }
   * });
   * ```
   */
  register(name: string, handler: (client: nodemod.Entity | null, args: string[]) => void): void {
    this.add({
      name,
      type: 'console',
      handler: (ctx: CommandContext) => handler(ctx.client, ctx.args.slice(1))
    });
  }

  /**
   * Convenience method to register a client-only command with a simplified handler signature.
   * The handler receives the client entity and arguments (excluding the command name).
   *
   * @param name - The command name
   * @param handler - Function that receives the client and arguments
   *
   * @example
   * ```typescript
   * nodemodCore.cmd.registerClient('kick', (client, args) => {
   *   const targetName = args[0];
   *   const reason = args.slice(1).join(' ');
   *   console.log(`${client.name} wants to kick ${targetName}: ${reason}`);
   * });
   * ```
   */
  registerClient(name: string, handler: (client: nodemod.Entity, args: string[]) => void): void {
    this.add({
      name,
      type: 'client',
      handler: (ctx: ClientCommandContext) => handler(ctx.client, ctx.args.slice(1))
    });
  }

  /**
   * Convenience method to register a server command with a simplified handler signature.
   * The handler receives the arguments (excluding the command name) but no client entity.
   *
   * @param name - The command name
   * @param handler - Function that receives the command arguments
   *
   * @example
   * ```typescript
   * nodemodCore.cmd.registerServer('ban', (args) => {
   *   const playerId = args[0];
   *   const duration = args[1] || '0';
   *   console.log(`Banning player ${playerId} for ${duration} minutes`);
   * });
   * ```
   */
  registerServer(name: string, handler: (args: string[]) => void): void {
    this.add({
      name,
      type: 'server',
      handler: (ctx: ServerCommandContext) => handler(ctx.args.slice(1))
    });
  }


  /**
   * Executes a server command through the native engine.
   * Automatically appends a newline character to the command.
   *
   * @param command - The server command to execute
   *
   * @example
   * ```typescript
   * nodemodCore.cmd.run('changelevel de_dust2');
   * nodemodCore.cmd.run('kick "Player Name"');
   * nodemodCore.cmd.run('say "Server announcement"');
   * ```
   */
  run(command: string): void {
    nodemod.eng.serverCommand(command + '\n');
  }
}
