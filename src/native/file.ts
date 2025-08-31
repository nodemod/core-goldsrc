/**
 * File buffer interface providing convenient access to loaded file data.
 */
export interface FileBuffer {
  /** Convert buffer to string with optional encoding */
  toString(encoding?: string): string;
  /** Size of the buffer in bytes */
  length: number;
}

/**
 * Result of a file loading operation with metadata.
 */
export interface FileLoadResult {
  /** Raw file buffer data or null if load failed */
  buffer: number[] | null;
  /** File size in bytes */
  size: number;
  /** Whether the file exists */
  exists: boolean;
}

/**
 * File system change event information.
 */
export interface FileWatchEvent {
  /** Name of the file that changed */
  filename: string;
  /** Type of change event */
  event: 'change';
  /** Previous file size in bytes */
  oldSize: number;
  /** New file size in bytes */
  newSize: number;
  /** Timestamp when change was detected */
  timestamp: number;
}

/** Callback function for file watch events */
export type FileWatchCallback = (event: FileWatchEvent) => void;

/** Callback function for processing loaded file data */
export type FileLoadCallback<T> = (buffer: FileBuffer | null, length?: number) => T;

/**
 * File system utilities for Half-Life engine providing safe file operations with automatic memory management.
 * Supports loading game resources, configuration files, and provides path utilities for Half-Life directory structure.
 * 
 * @example
 * ```typescript
 * // Load and read a configuration file
 * const config = nodemodCore.file.loadConfig('server.cfg');
 * if (config) {
 *   console.log(`Max players: ${config['maxplayers']}`);
 * }
 * 
 * // Check if a sound file exists
 * if (nodemodCore.file.isValidSoundFile('weapons/ak47-1.wav')) {
 *   console.log('Sound file is available');
 * }
 * 
 * // Load file with automatic cleanup
 * const content = nodemodCore.file.readText('motd.txt');
 * if (content) {
 *   console.log('MOTD:', content);
 * }
 * 
 * // Watch a file for changes
 * const stopWatching = nodemodCore.file.watch('banned.cfg', (event) => {
 *   console.log(`Banned list updated: ${event.newSize} bytes`);
 * });
 * ```
 */
export default class NodemodFile {
  
  /**
   * Loads a file into memory and returns the raw buffer.
   * Remember to call free() when done to prevent memory leaks.
   * 
   * @param filename - Path to the file to load
   * @returns Raw file buffer as number array, or null if loading failed
   * 
   * @example
   * ```typescript
   * const buffer = nodemodCore.file.load('maps/de_dust2.bsp');
   * if (buffer) {
   *   console.log(`Loaded ${buffer.length} bytes`);
   *   // Don't forget to free the buffer!
   *   nodemodCore.file.free(buffer);
   * }
   * ```
   */
  load(filename: string): number[] | null {
    try {
      const result = nodemod.eng.loadFileForMe(filename);
      return result;
    } catch (error) {
      console.error(`Failed to load file ${filename}:`, error);
      return null;
    }
  }
  
  // Free file buffer (important for memory management)
  free(buffer: number[] | null | any): void {
    if (buffer) {
      nodemod.eng.freeFile(buffer);
    }
  }
  
  // Get file size
  getSize(filename: string): number {
    return nodemod.eng.getFileSize(filename);
  }
  
  // Compare file modification times
  compareTime(filename1: string, filename2: string): number {
    const iCompare: number[] = [];
    return nodemod.eng.compareFileTime(filename1, filename2, iCompare);
  }
  
  // Check if file exists
  exists(filename: string): boolean {
    const size = this.getSize(filename);
    return size > 0;
  }
  
  // Load file with automatic cleanup
  loadWithCleanup<T>(filename: string, callback: FileLoadCallback<T>): T | null {
    const buffer = this.load(filename);
    if (!buffer) {
      return callback(null);
    }
    
    const fileBuffer: FileBuffer = {
      toString: (encoding?: string) => {
        // Convert number[] to string
        const bytes = new Uint8Array(buffer);
        const decoder = new TextDecoder(encoding || 'utf-8');
        return decoder.decode(bytes);
      },
      length: buffer.length
    };
    
    try {
      const result = callback(fileBuffer, fileBuffer.length);
      return result;
    } finally {
      this.free(buffer);
    }
  }
  
  /**
   * Reads a file as text with automatic memory management.
   * Handles encoding detection and cleanup automatically.
   * 
   * @param filename - Path to the text file to read
   * @returns File content as string, or null if reading failed
   * 
   * @example
   * ```typescript
   * // Read server configuration
   * const motd = nodemodCore.file.readText('motd.txt');
   * if (motd) {
   *   console.log('Message of the Day:', motd);
   * }
   * 
   * // Read map list
   * const mapList = nodemodCore.file.readText('mapcycle.txt');
   * if (mapList) {
   *   const maps = mapList.split('\\n').filter(line => line.trim());
   *   console.log('Available maps:', maps);
   * }
   * ```
   */
  readText(filename: string): string | null {
    return this.loadWithCleanup(filename, (buffer) => {
      if (!buffer) return null;
      
      // Convert buffer to string (basic implementation)
      try {
        return buffer.toString('utf8');
      } catch {
        return buffer.toString();
      }
    });
  }
  
  // Get game directory
  getGameDir(): string {
    const gameDir: string[] = [''];
    nodemod.eng.getGameDir(gameDir[0]);
    return gameDir[0];
  }
  
  // File path utilities
  joinPath(...parts: string[]): string {
    return parts.join('/').replace(/\/+/g, '/');
  }
  
  normalizePath(path: string): string {
    return path.replace(/\\/g, '/').replace(/\/+/g, '/');
  }
  
  getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot + 1).toLowerCase();
  }
  
  getBasename(filename: string): string {
    const lastSlash = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'));
    const name = lastSlash === -1 ? filename : filename.substring(lastSlash + 1);
    const lastDot = name.lastIndexOf('.');
    return lastDot === -1 ? name : name.substring(0, lastDot);
  }
  
  getDirectory(filename: string): string {
    const lastSlash = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'));
    return lastSlash === -1 ? '' : filename.substring(0, lastSlash);
  }
  
  // Resource file helpers
  buildResourcePath(type: string, name: string): string {
    const gameDir = this.getGameDir();
    const paths: { [key: string]: string } = {
      model: `${gameDir}/models/${name}`,
      sound: `${gameDir}/sound/${name}`,
      sprite: `${gameDir}/sprites/${name}`,
      map: `${gameDir}/maps/${name}`,
      config: `${gameDir}/${name}`
    };
    
    return this.normalizePath(paths[type] || `${gameDir}/${name}`);
  }
  
  // Check if resource file exists
  resourceExists(type: string, name: string): boolean {
    const path = this.buildResourcePath(type, name);
    return this.exists(path);
  }
  
  // Load resource file
  loadResource(type: string, name: string): number[] | null {
    const path = this.buildResourcePath(type, name);
    return this.load(path);
  }
  
  // Batch file operations
  loadMultiple(filenames: string[]): { [key: string]: FileLoadResult } {
    const results: { [key: string]: FileLoadResult } = {};
    
    filenames.forEach(filename => {
      results[filename] = {
        buffer: this.load(filename),
        size: this.getSize(filename),
        exists: this.exists(filename)
      };
    });
    
    return results;
  }
  
  // Clean up multiple file buffers
  freeMultiple(buffers: number[][] | { [key: string]: FileLoadResult | number[] }): void {
    if (Array.isArray(buffers)) {
      buffers.forEach(buffer => this.free(buffer));
    } else if (typeof buffers === 'object') {
      Object.values(buffers).forEach(item => {
        if (item && typeof item === 'object' && 'buffer' in item) {
          this.free((item as FileLoadResult).buffer);
        } else if (Array.isArray(item)) {
          this.free(item);
        }
      });
    }
  }
  
  // File validation
  isValidModelFile(filename: string): boolean {
    const ext = this.getExtension(filename);
    return ['mdl', 'bsp'].includes(ext) && this.exists(this.buildResourcePath('model', filename));
  }
  
  isValidSoundFile(filename: string): boolean {
    const ext = this.getExtension(filename);
    return ['wav', 'mp3'].includes(ext) && this.exists(this.buildResourcePath('sound', filename));
  }
  
  isValidMapFile(filename: string): boolean {
    const ext = this.getExtension(filename);
    return ext === 'bsp' && this.exists(this.buildResourcePath('map', filename));
  }
  
  /**
   * Loads and parses a configuration file with key=value format.
   * Supports comments starting with // or # and handles empty lines.
   * 
   * @param filename - Name of the configuration file
   * @returns Parsed configuration object, or null if loading failed
   * 
   * @example
   * ```typescript
   * // Load server configuration
   * const config = nodemodCore.file.loadConfig('server.cfg');
   * if (config) {
   *   const maxPlayers = parseInt(config['maxplayers'] || '16');
   *   const serverName = config['hostname'] || 'Unnamed Server';
   *   console.log(`Server: ${serverName}, Max Players: ${maxPlayers}`);
   * }
   * 
   * // Load custom plugin config
   * const pluginConfig = nodemodCore.file.loadConfig('myplugin.cfg');
   * if (pluginConfig?.enabled === '1') {
   *   console.log('Plugin is enabled');
   * }
   * ```
   */
  loadConfig(filename: string): { [key: string]: string } | null {
    const configPath = this.buildResourcePath('config', filename);
    const content = this.readText(configPath);
    
    if (!content) return null;
    
    // Parse simple key=value config format
    const config: { [key: string]: string } = {};
    const lines = content.split('\n');
    
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#')) {
        const equalPos = trimmed.indexOf('=');
        if (equalPos > 0) {
          const key = trimmed.substring(0, equalPos).trim();
          const value = trimmed.substring(equalPos + 1).trim();
          config[key] = value;
        }
      }
    });
    
    return config;
  }
  
  /**
   * Monitors a file for changes using periodic polling.
   * Returns a function to stop monitoring.
   * 
   * @param filename - File to monitor
   * @param callback - Function called when file changes
   * @param interval - Check interval in milliseconds (default: 1000)
   * @returns Function to stop monitoring
   * 
   * @example
   * ```typescript
   * // Watch configuration file for changes
   * const stopWatching = nodemodCore.file.watch('server.cfg', (event) => {
   *   console.log(`Config changed! Old size: ${event.oldSize}, New size: ${event.newSize}`);
   *   // Reload configuration
   *   const newConfig = nodemodCore.file.loadConfig('server.cfg');
   * });
   * 
   * // Stop watching after 10 minutes
   * setTimeout(() => {
   *   stopWatching();
   *   console.log('Stopped watching file');
   * }, 600000);
   * ```
   */
  watch(filename: string, callback: FileWatchCallback, interval: number = 1000): () => void {
    let lastSize = this.getSize(filename);
    let lastTime = Date.now();
    
    const watchInterval = setInterval(() => {
      const currentSize = this.getSize(filename);
      const currentTime = Date.now();
      
      if (currentSize !== lastSize) {
        callback({
          filename,
          event: 'change',
          oldSize: lastSize,
          newSize: currentSize,
          timestamp: currentTime
        });
        
        lastSize = currentSize;
        lastTime = currentTime;
      }
    }, interval);
    
    return () => clearInterval(watchInterval);
  }
  
  /**
   * Common Half-Life server file paths.
   */
  static PATHS = {
    /** Main server configuration file */
    CONFIG: 'server.cfg',
    /** Banned players list */
    BANNED: 'banned.cfg',
    /** IP ban list */
    LISTIP: 'listip.cfg',
    /** Map rotation cycle */
    MAPCYCLE: 'mapcycle.txt',
    /** Message of the day */
    MOTD: 'motd.txt'
  };
  
  /**
   * Valid file extensions for different resource types.
   */
  static EXTENSIONS = {
    /** Model file extensions */
    MODEL: ['mdl'],
    /** Sound file extensions */
    SOUND: ['wav', 'mp3'],
    /** Map file extensions */
    MAP: ['bsp'],
    /** Image file extensions */
    IMAGE: ['bmp', 'tga', 'jpg', 'jpeg', 'png'],
    /** Sprite file extensions */
    SPRITE: ['spr'],
    /** Configuration file extensions */
    CONFIG: ['cfg', 'txt', 'ini']
  };
}
