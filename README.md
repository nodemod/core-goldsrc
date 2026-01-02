# @nodemod/core

TypeScript-first NodeMod core library for Half-Life server development.

## Overview

NodeMod Core provides a comprehensive, type-safe API for Half-Life server development using TypeScript. It offers enhanced utilities, event handling, player management, and entity manipulation while maintaining full compatibility with the underlying NodeMod system.

This is the foundation that the admin system (`@nodemod/admin`) builds upon.

## Features

### Core Modules
- **Command System** - Register and handle server commands
- **Menu System** - Create interactive menus for players
- **Message System** - Send various types of messages to clients
- **Resource Management** - Handle server resources and downloads
- **Sound System** - Play sounds and manage audio

### Enhanced Modules
- **Player Management** - Advanced player utilities and information
- **Entity System** - Enhanced entity manipulation and wrapping
- **Event Handling** - Comprehensive event system with type safety
- **Trace System** - Ray tracing and collision detection

### Native Modules
- **CVar System** - Server variable management
- **File System** - File operations and management

### Utility Modules
- **General Utilities** - Common helper functions and tools
- **Entity Debugging** - Debug entity private data and offsets
- **Message Helpers** - Chat, HUD, and communication utilities

## Installation

```bash
npm install @nodemod/core
```

## Basic Usage

```typescript
import nodemodCore from '@nodemod/core';

// Send a message to all players
nodemodCore.util.messageAll('Hello from NodeMod Core!');

// Get all connected players
const players = nodemodCore.player.getAll();

// Create an entity
const entity = nodemodCore.entity.create('info_target');

// Register a command
nodemodCore.cmd.registerServer('my_command', (args) => {
    console.log('Command executed with args:', args);
});

// Wrap a CVAR for easy access
const myVar = nodemodCore.cvar.wrap('sv_cheats');
console.log(myVar.int); // Get as integer
myVar.set('1');         // Set value
```

## Using with the Admin System

For server administration features, use `@nodemod/admin` which extends this core library:

```typescript
import nodemodCore from '@nodemod/core';
import { BasePlugin, Plugin, PluginMetadata, ADMIN_KICK } from '@nodemod/admin';

class MyPlugin extends BasePlugin implements Plugin {
    readonly metadata: PluginMetadata = {
        name: 'My Plugin',
        version: '1.0.0',
        author: 'You'
    };

    constructor(pluginName: string) {
        super(pluginName);

        // Use core APIs
        const cvar = nodemodCore.cvar;

        // Use admin APIs (via BasePlugin)
        this.registerCommand('my_cmd', ADMIN_KICK, 'My command',
            (entity, args) => this.onCommand(entity, args));
    }
}

export default MyPlugin;
```

## Event Handling

```typescript
// Listen for player connections
nodemod.on('dllClientConnect', (entity) => {
    const name = entity.netname;
    console.log(`${name} connected`);
});

// Listen for player spawns
nodemod.on('dllPlayerSpawn', (entity) => {
    nodemodCore.util.sendChat(`Welcome ${entity.netname}!`, entity);
});

// Listen for chat messages
nodemod.on('dllClientCommand', (entity, text) => {
    if (text.startsWith('say ')) {
        const message = text.slice(4);
        console.log(`${entity.netname}: ${message}`);
    }
});
```

## Documentation

- **[NodeMod Documentation](https://nodemod.org)** - Full documentation
- **[API Reference](https://nodemod.org/docs/api)** - Complete API documentation
- **[Admin System](https://nodemod.org/docs/guides/admin-system)** - Admin system built on core

## License

MIT
