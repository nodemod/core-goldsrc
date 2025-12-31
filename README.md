# NodeMod Core

TypeScript-first NodeMod core library for Half-Life server development.

## Overview

NodeMod Core provides a comprehensive, type-safe API for Half-Life server development using TypeScript. It offers enhanced utilities, event handling, player management, and entity manipulation while maintaining full compatibility with the underlying NodeMod system.

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
```

## Documentation

Full API documentation is available in the `/docs` directory.

## License

MIT