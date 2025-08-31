import type NodemodUtil from '../utils/util';

/**
 * Configuration options for emitting sounds.
 */
export interface EmitSoundOptions {
  /** Target entity or entity index (0 for world entity) */
  entity?: nodemod.Entity | number;
  /** Audio channel to use */
  channel?: number;
  /** Path to the sound file */
  sound: string;
  /** Volume level (0.0 to 1.0) */
  volume?: number;
  /** Sound attenuation over distance */
  attenuation?: number;
  /** Sound transmission flags */
  flags?: number;
  /** Pitch adjustment (1-255, 100 = normal) */
  pitch?: number;
}

/**
 * Sound configuration alias for batch operations.
 */
export interface SoundConfig extends EmitSoundOptions {}

/**
 * Result of a sound emission operation.
 */
export interface SoundResult {
  /** Index in the batch operation */
  index: number;
  /** Whether the sound was successfully emitted */
  success: boolean;
  /** The configuration used for this sound */
  config: SoundConfig;
  /** Error message if emission failed */
  error?: string;
}

/**
 * Audio channel constants for categorizing sounds.
 */
export const SoundChannel = {
  /** Automatically select appropriate channel */
  auto: 0,
  /** Weapon sounds */
  weapon: 1,
  /** Voice communications */
  voice: 2,
  /** Item interaction sounds */
  item: 3,
  /** Body/movement sounds */
  body: 4,
  /** Streaming audio */
  stream: 5,
  /** Static/ambient sounds */
  static: 6,
  /** Network voice communication base */
  networkVoiceBase: 7,
  /** Network voice communication end */
  networkVoiceEnd: 500
};

/**
 * Enhanced sound system providing comprehensive audio functionality for the game server.
 * Handles sound emission, validation, and management with improved defaults and error handling.
 * 
 * @example
 * ```typescript
 * // Play a weapon sound
 * nodemodCore.sound.emitSound({
 *   entity: player,
 *   channel: SoundChannel.weapon,
 *   sound: 'weapons/ak47/ak47-1.wav',
 *   volume: 0.8,
 *   pitch: 110
 * });
 * 
 * // Broadcast ambient sound to all players
 * nodemodCore.sound.broadcastSound('ambient/music/track1.wav', {
 *   volume: 0.5,
 *   attenuation: 0.5
 * });
 * 
 * // Play client-side sound command
 * nodemodCore.sound.emitClientSound(player, 'ui/buttonclick');
 * ```
 */
export default class NodemodSound {
  /** Utility service for entity operations */
  private util: NodemodUtil;

  /**
   * Creates a new NodemodSound instance.
   * 
   * @param utilService - Utility service for entity operations
   */
  constructor(utilService: NodemodUtil) {
    this.util = utilService;
  }

  /**
   * Emits a sound with enhanced validation and default values.
   * Provides better parameter validation and clamping than the basic engine function.
   * 
   * @param options - Sound emission configuration
   * @returns True if sound was emitted successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Basic sound emission
   * nodemodCore.sound.emitSound({
   *   sound: 'weapons/ak47/ak47-1.wav'
   * });
   * 
   * // Advanced sound with all options
   * nodemodCore.sound.emitSound({
   *   entity: player,
   *   channel: SoundChannel.weapon,
   *   sound: 'weapons/ak47/ak47-1.wav',
   *   volume: 0.8,
   *   attenuation: 1.5,
   *   flags: 0, // Normal playback
   *   pitch: 110
   * });
   * ```
   */
  emitSound(options: EmitSoundOptions): boolean {
    const {
      entity = 0,
      channel = SoundChannel.auto,
      sound,
      volume = 1.0,
      attenuation = 1.0,
      flags = 0,
      pitch = 100
    } = options;

    if (!sound) {
      console.error('NodemodSound.emitSound: sound parameter is required');
      return false;
    }

    const entityObj = entity ? this.util.forceEntityObject(entity) : nodemod.eng.pEntityOfEntIndex(0);
    
    nodemod.eng.emitSound(
      entityObj!,
      channel,
      sound,
      Math.max(0, Math.min(1, volume)), // Clamp volume 0-1
      Math.max(0, attenuation),
      flags,
      Math.max(1, Math.min(255, pitch))  // Clamp pitch 1-255
    );
    return true;
  }

  /**
   * Sends a client-side sound command to a specific player.
   * Uses the client's `spk` command to play sounds locally.
   * 
   * @param entity - Target player entity or index
   * @param soundName - Name of the sound file (with or without extension)
   * @param extension - File extension to append if not present in soundName
   * @returns True if command was sent successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Play UI sound to player
   * nodemodCore.sound.emitClientSound(player, 'ui/buttonclick');
   * 
   * // Play custom sound with specific extension
   * nodemodCore.sound.emitClientSound(player, 'custom/notification', 'mp3');
   * ```
   */
  emitClientSound(entity: nodemod.Entity | number, soundName: string, extension: string = 'wav'): boolean {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) {
      console.error('NodemodSound.emitClientSound: invalid entity');
      return false;
    }

    const soundPath = soundName.includes('.') ? soundName : `${soundName}.${extension}`;
    nodemod.eng.clientCommand(entityObj, `spk sound/${soundPath}\n`);
    return true;
  }

  /**
   * Emits an ambient sound at a specific 3D position.
   * Useful for environmental sounds, explosions, or location-based audio.
   * 
   * @param position - 3D coordinates [x, y, z] where the sound originates
   * @param sound - Path to the sound file
   * @param volume - Volume level (0.0 to 1.0)
   * @param attenuation - How quickly sound fades with distance
   * @param flags - Sound transmission flags
   * @param pitch - Pitch adjustment (1-255, 100 = normal)
   * @returns True if sound was emitted successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Explosion sound at coordinates
   * nodemodCore.sound.emitAmbientSound(
   *   [100, 200, 50],
   *   'weapons/explode1.wav',
   *   0.9,
   *   2.0
   * );
   * 
   * // Ambient environmental sound
   * nodemodCore.sound.emitAmbientSound(
   *   [0, 0, 0],
   *   'ambient/wind/wind1.wav',
   *   0.3,
   *   0.5,
   *   nodemod.SND.SPAWNING
   * );
   * ```
   */
  emitAmbientSound(position: number[], sound: string, volume: number = 1.0, attenuation: number = 1.0, flags: number = 0, pitch: number = 100): boolean {
    if (!sound || !Array.isArray(position) || position.length < 3) {
      console.error('NodemodSound.emitAmbientSound: invalid parameters');
      return false;
    }

    nodemod.eng.emitAmbientSound(
      null!, // entity parameter - using null for ambient sounds
      position,
      sound,
      Math.max(0, Math.min(1, volume)),
      Math.max(0, attenuation),
      flags,
      Math.max(1, Math.min(255, pitch))
    );
    return true;
  }

  /**
   * Broadcasts a sound to all players on the server.
   * Convenient wrapper for playing sounds that everyone should hear.
   * 
   * @param sound - Path to the sound file
   * @param options - Optional sound configuration overrides
   * @returns True if sound was broadcast successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Simple server announcement sound
   * nodemodCore.sound.broadcastSound('admin/announcement.wav');
   * 
   * // Round start music with custom settings
   * nodemodCore.sound.broadcastSound('music/roundstart.wav', {
   *   volume: 0.7,
   *   channel: SoundChannel.stream,
   *   attenuation: 0.1
   * });
   * ```
   */
  broadcastSound(sound: string, options: Partial<EmitSoundOptions> = {}): boolean {
    const soundOptions: EmitSoundOptions = {
      entity: 0, // World entity
      channel: SoundChannel.auto,
      sound,
      volume: 1.0,
      attenuation: 1.0,
      flags: 0,
      pitch: 100,
      ...options
    };

    return this.emitSound(soundOptions);
  }

  /**
   * Attempts to stop a sound on a specific entity.
   * Uses a workaround by playing a very quiet sound since direct stop may not be available.
   * 
   * @param entity - Target entity or entity index
   * @param channel - Audio channel to stop
   * @param sound - Specific sound to stop (empty for all sounds on channel)
   * @returns True if stop attempt was successful, false otherwise
   * 
   * @example
   * ```typescript
   * // Stop all sounds on entity
   * nodemodCore.sound.stopSound(player);
   * 
   * // Stop weapon channel sounds
   * nodemodCore.sound.stopSound(player, SoundChannel.weapon);
   * ```
   */
  stopSound(entity: nodemod.Entity | number, channel: number = SoundChannel.auto, sound: string = ''): boolean {
    const entityObj = this.util.forceEntityObject(entity);
    if (!entityObj) return false;

    // Fallback: emit very quiet sound to "override" since stopSound may not be available
    return this.emitSound({
      entity: entityObj,
      channel,
      sound: sound || 'common/null.wav',
      volume: 0.001,
      pitch: 1
    });
  }

  /**
   * Validates whether a sound file path is valid.
   * Checks for supported file extensions and proper format.
   * 
   * @param soundPath - Path to the sound file to validate
   * @returns True if the sound path is valid, false otherwise
   * 
   * @example
   * ```typescript
   * // Valid sound files
   * console.log(nodemodCore.sound.isValidSound('weapons/ak47-1.wav')); // true
   * console.log(nodemodCore.sound.isValidSound('music/track.mp3')); // true
   * 
   * // Invalid sound files
   * console.log(nodemodCore.sound.isValidSound('invalid.txt')); // false
   * console.log(nodemodCore.sound.isValidSound('')); // false
   * ```
   */
  isValidSound(soundPath: string): boolean {
    if (!soundPath || typeof soundPath !== 'string') return false;
    
    const validExtensions = ['wav', 'mp3'];
    const extension = soundPath.split('.').pop()?.toLowerCase();
    
    return extension ? validExtensions.includes(extension) : false;
  }

  /**
   * Emits multiple sounds in batch with individual result tracking.
   * Useful for playing multiple sounds simultaneously or handling bulk operations.
   * 
   * @param soundConfigs - Array of sound configurations to emit
   * @returns Array of results indicating success/failure for each sound
   * 
   * @example
   * ```typescript
   * const sounds = [
   *   { sound: 'weapons/ak47/ak47-1.wav', entity: player1, volume: 0.8 },
   *   { sound: 'weapons/deagle/deagle-1.wav', entity: player2, volume: 0.9 },
   *   { sound: 'items/ammopickup2.wav', volume: 0.5 }
   * ];
   * 
   * const results = nodemodCore.sound.emitMultipleSounds(sounds);
   * results.forEach((result, i) => {
   *   if (result.success) {
   *     console.log(`Sound ${i} played successfully`);
   *   } else {
   *     console.log(`Sound ${i} failed: ${result.error}`);
   *   }
   * });
   * ```
   */
  emitMultipleSounds(soundConfigs: SoundConfig[]): SoundResult[] {
    const results: SoundResult[] = [];
    
    soundConfigs.forEach((config, index) => {
      try {
        const result = this.emitSound(config);
        results.push({ index, success: result, config });
      } catch (error) {
        results.push({ index, success: false, error: error instanceof Error ? error.message : String(error), config });
      }
    });

    return results;
  }
}
