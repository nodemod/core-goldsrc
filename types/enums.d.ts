// This file is generated automatically. Don't edit it.
declare namespace nodemod {
  // Metamod result constants
  const enum MRES {
    UNSET = 0,    // Uninitialized (causes error)
    IGNORED = 1,  // Plugin didn't take any action, continue normally
    HANDLED = 2,  // Plugin did something, but original function still executes
    OVERRIDE = 3, // Execute original function, but use plugin's return value
    SUPERCEDE = 4 // Skip original function entirely, use plugin's behavior
  }

  // Alert types for engine functions
  const enum ALERT_TYPE {
    at_notice = 0,
    at_console = 1,
    at_aiconsole = 2,
    at_warning = 3,
    at_error = 4,
    at_logged = 5
  }

  // Print types for client output
  const enum PRINT_TYPE {
    print_console = 0,
    print_center = 1,
    print_chat = 2
  }

  // Force types for consistency checking
  const enum FORCE_TYPE {
    force_exactfile = 0,
    force_model_samebounds = 1,
    force_model_specifybounds = 2,
    force_model_specifybounds_if_avail = 3
  }


  // Network message types for Half-Life protocol (SVC = Server to Client)
  const enum SVC {
    BAD = 0,
    NOP = 1,
    DISCONNECT = 2,
    EVENT = 3,
    VERSION = 4,
    SETVIEW = 5,
    SOUND = 6,
    TIME = 7,
    PRINT = 8,
    STUFFTEXT = 9,
    SETANGLE = 10,
    SERVERINFO = 11,
    LIGHTSTYLE = 12,
    UPDATEUSERINFO = 13,
    DELTADESCRIPTION = 14,
    CLIENTDATA = 15,
    STOPSOUND = 16,
    PINGS = 17,
    PARTICLE = 18,
    DAMAGE = 19,
    SPAWNSTATIC = 20,
    EVENT_RELIABLE = 21,
    SPAWNBASELINE = 22,
    TEMPENTITY = 23,
    SETPAUSE = 24,
    SIGNONNUM = 25,
    CENTERPRINT = 26,
    KILLEDMONSTER = 27,
    FOUNDSECRET = 28,
    SPAWNSTATICSOUND = 29,
    INTERMISSION = 30,
    FINALE = 31,
    CDTRACK = 32,
    RESTORE = 33,
    CUTSCENE = 34,
    WEAPONANIM = 35,
    DECALNAME = 36,
    ROOMTYPE = 37,
    ADDANGLE = 38,
    NEWUSERMSG = 39,
    PACKETENTITIES = 40,
    DELTAPACKETENTITIES = 41,
    CHOKE = 42,
    RESOURCELIST = 43,
    NEWMOVEVARS = 44,
    RESOURCEREQUEST = 45,
    CUSTOMIZATION = 46,
    CROSSHAIRANGLE = 47,
    SOUNDFADE = 48,
    FILETXFERFAILED = 49,
    HLTV = 50,
    DIRECTOR = 51,
    VOICEINIT = 52,
    VOICEDATA = 53,
    SENDEXTRAINFO = 54,
    TIMESCALE = 55,
    RESOURCELOCATION = 56,
    SENDCVARVALUE = 57,
    SENDCVARVALUE2 = 58
  }


  // Sound flags for pfnEmitSound fFlags parameter
  const enum SND {
    SPAWNING = 256,     // 1<<8 - We're spawning, used in some cases for ambients
    STOP = 32,          // 1<<5 - Stop sound
    CHANGE_VOL = 64,    // 1<<6 - Change sound volume
    CHANGE_PITCH = 128  // 1<<7 - Change sound pitch
  }

  // Console variable (cvar) flags
  const enum FCVAR {
    NONE = 0,                // No flags
    ARCHIVE = 1,             // 1<<0 - Set to cause it to be saved to vars.rc
    USERINFO = 2,            // 1<<1 - Changes the client's info string
    SERVER = 4,              // 1<<2 - Notifies players when changed
    EXTDLL = 8,              // 1<<3 - Defined by external DLL
    CLIENTDLL = 16,          // 1<<4 - Defined by the client dll
    PROTECTED = 32,          // 1<<5 - Server cvar, but we don't send the data since it's a password, etc.
    SPONLY = 64,             // 1<<6 - This cvar cannot be changed by clients connected to a multiplayer server
    PRINTABLEONLY = 128,     // 1<<7 - This cvar's string cannot contain unprintable characters
    UNLOGGED = 256,          // 1<<8 - If this is a FCVAR_SERVER, don't log changes to the log file / console
    NOEXTRAWHITEPACE = 512   // 1<<9 - Strip trailing/leading white space from this cvar
  }




  /** engfunc(EngFunc_MoveToOrigin, entity, Float:goal[3], Float:distance, moveType) moveType values */
  const enum MOVE {
    NORMAL = 0,  // normal move in the direction monster is facing
    STRAFE = 1   // moves in direction specified, no matter which way monster is facing
  }



  /** Spectating camera mode constants (usually stored in pev_iuser1) */
  const enum OBS {
    NONE = 0,
    CHASE_LOCKED = 1,  // Locked Chase Cam
    CHASE_FREE = 2,    // Free Chase Cam
    ROAMING = 3,       // Free Look
    IN_EYE = 4,        // First Person
    MAP_FREE = 5,      // Free Overview
    MAP_CHASE = 6      // Chase Overview
  }


  /** Instant damage values for use with the 3rd parameter of the "Damage" client message */
  const enum DMG {
    GENERIC = 0,         // Generic damage was done
    CRUSH = 1,           // 1<<0 - Crushed by falling or moving object
    BULLET = 2,          // 1<<1 - Shot
    SLASH = 4,           // 1<<2 - Cut, clawed, stabbed
    BURN = 8,            // 1<<3 - Heat burned
    FREEZE = 16,         // 1<<4 - Frozen
    FALL = 32,           // 1<<5 - Fell too far
    BLAST = 64,          // 1<<6 - Explosive blast damage
    CLUB = 128,          // 1<<7 - Crowbar, punch, headbutt
    SHOCK = 256,         // 1<<8 - Electric shock
    SONIC = 512,         // 1<<9 - Sound pulse shockwave
    ENERGYBEAM = 1024,   // 1<<10 - Laser or other high energy beam
    NEVERGIB = 4096,     // 1<<12 - With this bit OR'd in, no damage type will be able to gib victims upon death
    ALWAYSGIB = 8192,    // 1<<13 - With this bit OR'd in, any damage type can be made to gib victims upon death
    DROWN = 16384,       // 1<<14 - Drowning
    PARALYZE = 32768,    // 1<<15 - Slows affected creature down
    NERVEGAS = 65536,    // 1<<16 - Nerve toxins, very bad
    POISON = 131072,     // 1<<17 - Blood poisioning
    RADIATION = 262144,  // 1<<18 - Radiation exposure
    DROWNRECOVER = 524288, // 1<<19 - Drowning recovery
    ACID = 1048576,      // 1<<20 - Toxic chemicals or acid burns
    SLOWBURN = 2097152,  // 1<<21 - In an oven
    SLOWFREEZE = 4194304, // 1<<22 - In a subzero freezer
    MORTAR = 8388608,    // 1<<23 - Hit by air raid
    GRENADE = 16777216   // 1<<24 - Counter-Strike only - Hit by HE grenade
  }

  /** Gib values used on client kill based on instant damage values */
  const enum GIB {
    NORMAL = 0,      // Gib if entity was overkilled
    NEVER = 1,       // Never gib, no matter how much death damage is done
    ALWAYS = 2,      // Always gib
    TRY_HEALTH = -9000 // Gib players if their health is under this value
  }

  /** Valid constants for fNoMonsters parameter of trace functions */
  const enum IGNORE {
    DONT_IGNORE_MONSTERS = 0,
    MONSTERS = 1,
    MISSILE = 2,
    GLASS = 0x100
  }

  /** Hull numbers for trace functions */
  const enum HULL {
    POINT = 0,
    HUMAN = 1,
    LARGE = 2,
    HEAD = 3
  }

  /** Half-Life weapon constants */
  const enum HLW {
    NONE = 0,
    CROWBAR = 1,
    GLOCK = 2,
    PYTHON = 3,
    MP5 = 4,
    CHAINGUN = 5,
    CROSSBOW = 6,
    SHOTGUN = 7,
    RPG = 8,
    GAUSS = 9,
    EGON = 10,
    HORNETGUN = 11,
    HANDGRENADE = 12,
    TRIPMINE = 13,
    SATCHEL = 14,
    SNARK = 15,
    SUIT = 31
  }

  /** Player physics flags */
  const enum PFLAG {
    ONLADDER = 1,    // 1<<0
    ONSWING = 1,     // 1<<0
    ONTRAIN = 2,     // 1<<1
    ONBARNACLE = 4,  // 1<<2
    DUCKING = 8,     // 1<<3 - In the process of ducking, but not totally squatted yet
    USING = 16,      // 1<<4 - Using a continuous entity
    OBSERVER = 32    // 1<<5 - Player is locked in stationary cam mode
  }

  /** Player hide HUD values */
  const enum HIDEHUD {
    WEAPONS = 1,             // 1<<0
    FLASHLIGHT = 2,          // 1<<1
    ALL = 4,                 // 1<<2
    HEALTH = 8,              // 1<<3
    TIMER = 16,              // 1<<4
    MONEY = 32,              // 1<<5
    CROSSHAIR = 64,          // 1<<6
    OBSERVER_CROSSHAIR = 128 // 1<<7
  }

  /** Entity classification */
  const enum CLASS {
    NONE = 0,
    MACHINE = 1,
    PLAYER = 2,
    HUMAN_PASSIVE = 3,
    HUMAN_MILITARY = 4,
    ALIEN_MILITARY = 5,
    ALIEN_PASSIVE = 6,
    ALIEN_MONSTER = 7,
    ALIEN_PREY = 8,
    ALIEN_PREDATOR = 9,
    INSECT = 10,
    PLAYER_ALLY = 11,
    PLAYER_BIOWEAPON = 12,
    ALIEN_BIOWEAPON = 13,
    VEHICLE = 14,
    BARNACLE = 99
  }

  /** Entity use states */
  const enum USE {
    OFF = 0,
    ON = 1,
    SET = 2,
    TOGGLE = 3
  }

  /** PlaybackEvent flags */
  const enum FEV {
    NOTHOST = 1,    // 1<<0 - Skip local host for event send
    RELIABLE = 2,   // 1<<1 - Send the event reliably
    GLOBAL = 4,     // 1<<2 - Send to everybody on the server
    UPDATE = 8,     // 1<<3 - Update existing event instead of duplicate
    HOSTONLY = 16,  // 1<<4 - Only send to entity specified as the invoker
    SERVER = 32,    // 1<<5 - Only send if the event was created on the server
    CLIENT = 64     // 1<<6 - Only issue event client side
  }


  /** pev(entity, pev_flags) values - from const.h */
  const enum FL {
    DORMANT = -2147483648, // Entity is dormant, no updates to client
    FLY = 1, // Changes the SV_Movestep() behavior to not need to be on ground
    SWIM = 2, // Changes the SV_Movestep() behavior to not need to be on ground (but stay in water)
    CONVEYOR = 4,
    CLIENT = 8,
    INWATER = 16,
    MONSTER = 32,
    GODMODE = 64,
    NOTARGET = 128,
    SKIPLOCALHOST = 256, // Don't send entity to local host, it's predicting this entity itself
    ONGROUND = 512, // At rest / on the ground
    PARTIALGROUND = 1024, // not all corners are valid
    WATERJUMP = 2048, // player jumping out of water
    FROZEN = 4096, // Player is frozen for 3rd person camera
    FAKECLIENT = 8192, // JAC: fake client, simulated server side; don't send network messages to them
    DUCKING = 16384, // Player flag -- Player is fully crouched
    FLOAT = 32768, // Apply floating force to this entity when in water
    GRAPHED = 65536, // worldgraph has this ent listed as something that blocks a connection
    IMMUNE_WATER = 131072,
    IMMUNE_SLIME = 262144,
    IMMUNE_LAVA = 524288,
    PROXY = 1048576, // This is a spectator proxy
    ALWAYSTHINK = 2097152, // Brush model flag -- call think every frame regardless of nextthink - ltime (for constantly changing velocity/path)
    BASEVELOCITY = 4194304, // Base velocity has been applied this frame (used to convert base velocity into momentum)
    MONSTERCLIP = 8388608, // Only collide in with monsters who have FL_MONSTERCLIP set
    ONTRAIN = 16777216, // Player is _controlling_ a train, so movement commands should be ignored on client during prediction.
    WORLDBRUSH = 33554432, // Not moveable/removeable brush entity (really part of the world, but represented as an entity for transparency or something)
    SPECTATOR = 67108864, // This client is a spectator, don't run touch functions, etc.
    CUSTOMENTITY = 536870912, // This is a custom entity
    KILLME = 1073741824, // This entity is marked for death -- This allows the engine to kill ents at the appropriate time
  }
  /** Trace flags for globalvars_t.trace_flags */
  const enum FTRACE {
    SIMPLEBOX = 1, // Traceline with a simple box
    IGNORE_GLASS = 2, // traceline will be ignored entities with rendermode != kRenderNormal
  }
  /** engfunc(EngFunc_WalkMove) iMode values */
  const enum WALKMOVE {
    NORMAL = 0, // normal walkmove
    WORLDONLY = 1, // doesn't hit ANY entities, no matter what the solid type
    CHECKONLY = 2, // move, but don't touch triggers
  }
  /** pev(entity, pev_movetype) values */
  const enum MOVETYPE {
    NONE = 0, // never moves
    WALK = 3, // Player only - moving on the ground
    STEP = 4, // gravity, special edge handling -- monsters use this
    FLY = 5, // No gravity, but still collides with stuff
    TOSS = 6, // gravity/collisions
    PUSH = 7, // no clip to world, push and crush
    NOCLIP = 8, // No gravity, no collisions, still do velocity/avelocity
    FLYMISSILE = 9, // extra size to monsters
    BOUNCE = 10, // Just like Toss, but reflect velocity when contacting surfaces
    BOUNCEMISSILE = 11, // bounce w/o gravity
    FOLLOW = 12, // track movement of aiment
    PUSHSTEP = 13, // BSP model that needs physics/world collisions (uses nearest hull for world collision)
    COMPOUND = 14, // glue two entities together (simple movewith)
  }
  /** pev(entity, pev_solid) values */
  const enum SOLID {
    NOT = 0, // no interaction with other objects
    TRIGGER = 1, // touch on edge, but not blocking
    BBOX = 2, // touch on edge, block
    SLIDEBOX = 3, // touch on edge, but not an onground
    BSP = 4, // bsp clip, touch on edge, block
    CUSTOM = 5, // call external callbacks for tracing
  }
  /** pev(entity, pev_deadflag) values */
  const enum DEAD {
    NO = 0, // alive
    DYING = 1, // playing death animation or still falling off of a ledge waiting to hit ground
    DEAD = 2, // dead. lying still.
    RESPAWNABLE = 3,
    DISCARDBODY = 4,
  }
  /** pev(entity, pev_takedamage) values */
  const enum DAMAGE {
    NO = 0,
    YES = 1,
    AIM = 2, // entity effects
  }
  /** pev(entity, pev_effects) values */
  const enum EF {
    BRIGHTFIELD = 1, // swirling cloud of particles
    MUZZLEFLASH = 2, // single frame ELIGHT on entity attachment 0
    BRIGHTLIGHT = 4, // DLIGHT centered at entity origin
    DIMLIGHT = 8, // player flashlight
    INVLIGHT = 16, // get lighting from ceiling
    NOINTERP = 32, // don't interpolate the next frame
    LIGHT = 64, // rocket flare glow sprite
    NODRAW = 128, // don't draw entity
    NIGHTVISION = 256, // player nightvision
    SNIPERLASER = 512, // sniper laser effect
    FIBERCAMERA = 1024, // fiber camera
    NOREFLECT = 16777216, // Entity won't reflecting in mirrors
    REFLECTONLY = 33554432, // Entity will be drawing only in mirrors
    NOWATERCSG = 67108864, // Do not remove sides for func_water entity
    FULLBRIGHT = 134217728, // Just get fullbright
    NOSHADOW = 268435456, // ignore shadow for this entity
    MERGE_VISIBILITY = 536870912, // this entity allowed to merge vis (e.g. env_sky or portal camera)
    REQUEST_PHS = 1073741824, // This entity requested phs bitvector instead of pvsbitvector in AddToFullPack calls
  }
  /** Entity flags */
  const enum EFLAG {
    SLERP = 1, // do studio interpolation of this entity
  }
  /** Temp entity types for MSG_TYPE.TEMPENTITY messages */
  const enum TE {
    BEAMPOINTS = 0, // beam effect between two points
    BEAMENTPOINT = 1, // beam effect between point and entity
    GUNSHOT = 2, // particle effect plus ricochet sound
    EXPLOSION = 3, // additive sprite, 2 dynamic lights, flickering particles, explosion sound, move vertically 8 pps
    TAREXPLOSION = 4, // Quake1 "tarbaby" explosion with sound
    SMOKE = 5, // alphablend sprite, move vertically 30 pps
    TRACER = 6, // tracer effect from point to point
    LIGHTNING = 7, // TE_BEAMPOINTS with simplified parameters
    BEAMENTS = 8, // short (start entity)
    SPARKS = 9, // 8 random tracers with gravity, ricochet sprite
    LAVASPLASH = 10, // Quake1 lava splash
    TELEPORT = 11, // Quake1 teleport splash
    EXPLOSION2 = 12, // Quake1 colormaped (base palette) particle explosion with sound
    BSPDECAL = 13, // Decal from the .BSP file
    IMPLOSION = 14, // tracers moving toward a point
    SPRITETRAIL = 15, // line of moving glow sprites with gravity, fadeout, and collisions
    BEAM = 16, // obsolete
    SPRITE = 17, // additive sprite, plays 1 cycle
    BEAMSPRITE = 18, // A beam with a sprite at the end
    BEAMTORUS = 19, // screen aligned beam ring, expands to max radius over lifetime
    BEAMDISK = 20, // disk that expands to max radius over lifetime
    BEAMCYLINDER = 21, // cylinder that expands to max radius over lifetime
    BEAMFOLLOW = 22, // create a line of decaying beam segments until entity stops moving
    GLOWSPRITE = 23, // coord, coord, coord (pos) short (model index) byte (scale / 10)
    BEAMRING = 24, // connect a beam ring to two entities
    STREAK_SPLASH = 25, // oriented shower of tracers
    BEAMHOSE = 26, // obsolete
    DLIGHT = 27, // dynamic light, effect world, minor entity effect
    ELIGHT = 28, // point entity light, no world effect
    TEXTMESSAGE = 29, // short 1.2.13 x (-1 = center)
    LINE = 30, // coord, coord, coord	startpos
    BOX = 31, // coord, coord, coord	boxmins
    KILLBEAM = 99, // kill all beams attached to entity
    LARGEFUNNEL = 100, // coord coord coord (funnel position)
    BLOODSTREAM = 101, // particle spray
    SHOWLINE = 102, // line of particles every 5 units, dies in 30 seconds
    BLOOD = 103, // particle spray
    DECAL = 104, // Decal applied to a brush entity (not the world)
    FIZZ = 105, // create alpha sprites inside of entity, float upwards
    MODEL = 106, // create a moving model that bounces and makes a sound when it hits
    EXPLODEMODEL = 107, // spherical shower of models, picks from set
    BREAKMODEL = 108, // box of models or sprites
    GUNSHOTDECAL = 109, // decal and ricochet sound
    SPRITE_SPRAY = 110, // spay of alpha sprites
    ARMOR_RICOCHET = 111, // quick spark sprite, client ricochet sound.
    PLAYERDECAL = 112, // ???
    BUBBLES = 113, // create alpha sprites inside of box, float upwards
    BUBBLETRAIL = 114, // create alpha sprites along a line, float upwards
    BLOODSPRITE = 115, // spray of opaque sprite1's that fall, single sprite2 for 1..2 secs (this is a high-priority tent)
    WORLDDECAL = 116, // Decal applied to the world brush
    WORLDDECALHIGH = 117, // Decal (with texture index > 256) applied to world brush
    DECALHIGH = 118, // Same as TE_DECAL, but the texture index was greater than 256
    PROJECTILE = 119, // Makes a projectile (like a nail) (this is a high-priority tent)
    SPRAY = 120, // Throws a shower of sprites or models
    PLAYERSPRITES = 121, // sprites emit from a player's bounding box (ONLY use for players!)
    PARTICLEBURST = 122, // very similar to lavasplash.
    FIREFIELD = 123, // makes a field of fire.
    PLAYERATTACHMENT = 124, // attaches a TENT to a player (this is a high-priority tent)
    KILLPLAYERATTACHMENTS = 125, // will expire all TENTS attached to a player.
    MULTIGUNSHOT = 126, // much more compact shotgun message
    USERTRACER = 127, // larger message than the standard tracer, but allows some customization.
  }
  /** TE_EXPLOSION flags */
  const enum TE_EXPLFLAG {
    NONE = 0, // all flags clear makes default Half-Life explosion
    NOADDITIVE = 1, // sprite will be drawn opaque (ensure that the sprite you send is a non-additive sprite)
    NODLIGHTS = 2, // do not render dynamic lights
    NOSOUND = 4, // do not play client explosion sound
    NOPARTICLES = 8, // do not draw particles
    DRAWALPHA = 16, // sprite will be drawn alpha
    ROTATE = 32, // rotate the sprite randomly
  }
  /** TE bounce sound types for TE_MODEL */
  const enum TE_BOUNCE {
    NULL = 0,
    SHELL = 1,
    SHOTSHELL = 2, // Rendering constants
  }
  /** TE_FIREFIELD flags */
  const enum TEFIRE_FLAG {
    ALLFLOAT = 1, // all sprites will drift upwards as they animate
    SOMEFLOAT = 2, // some of the sprites will drift upwards. (50% chance)
    LOOP = 4, // if set, sprite plays at 15 fps, otherwise plays at whatever rate stretches the animation over the sprite's duration.
    ALPHA = 8, // if set, sprite is rendered alpha blended at 50% else, opaque
    PLANAR = 16, // if set, all fire sprites have same initial Z instead of randomly filling a cube.
    ADDITIVE = 32, // if set, sprite is rendered non-opaque with additive
  }
  /** Message destination types for engine messaging */
  const enum MSG {
    BROADCAST = 0, // unreliable to all
    ONE = 1, // reliable to one (msg_entity)
    ALL = 2, // reliable to all
    INIT = 3, // write to the init string
    PVS = 4, // Ents in PVS of org
    PAS = 5, // Ents in PAS of org
    PVS_R = 6, // Reliable to PVS
    PAS_R = 7, // Reliable to PAS
    ONE_UNRELIABLE = 8, // Send to one client, but don't put in reliable stream, put in unreliable datagram ( could be dropped )
    SPEC = 9, // Sends to all spectator proxies
  }
  /** engfunc(EngFunc_PointContents) return values */
  const enum CONTENTS {
    LADDER = -16,
    TRANSLUCENT = -15,
    CURRENT_DOWN = -14,
    CURRENT_UP = -13,
    CURRENT_270 = -12,
    CURRENT_180 = -11,
    CURRENT_90 = -10,
    CURRENT_0 = -9,
    CLIP = -8, // changed to contents_solid
    ORIGIN = -7, // removed at csg time
    SKY = -6, // These additional contents constants are defined in bspfile.h
    LAVA = -5,
    SLIME = -4,
    WATER = -3,
    SOLID = -2,
    EMPTY = -1,
  }
  /** Sound channel constants */
  const enum CHAN {
    AUTO = 0,
    WEAPON = 1,
    VOICE = 2,
    ITEM = 3,
    BODY = 4,
    STREAM = 5, // allocate stream channel from the static or dynamic area
    STATIC = 6, // allocate channel from the static area
    NETWORKVOICE_BASE = 7, // voice data coming across the network
    NETWORKVOICE_END = 500, // network voice data reserves slots (CHAN_NETWORKVOICE_BASE through CHAN_NETWORKVOICE_END).
    BOT = 501, // channel used for bot chatter.
  }
  /** Sound attenuation constants for pfnEmitSound */
  const enum ATTN {
    NONE = 0,
    NORM = 0.8,
    STATIC = 1.25, // pitch values
    IDLE = 2,
  }
  /** Sound pitch constants */
  const enum PITCH {
    LOW = 95, // other values are possible - 0-255, where 255 is very high
    NORM = 100, // non-pitch shifted
    HIGH = 120, // volume values
  }
  /** Sound volume constants */
  const enum VOL {
    NORM = 1, // plats
  }
  /** pev(entity, pev_button) or pev(entity, pev_oldbuttons) values */
  const enum IN {
    ATTACK = 1,
    JUMP = 2,
    DUCK = 4,
    FORWARD = 8,
    BACK = 16,
    USE = 32,
    CANCEL = 64,
    LEFT = 128,
    RIGHT = 256,
    MOVELEFT = 512,
    MOVERIGHT = 1024,
    ATTACK2 = 2048,
    RUN = 4096,
    RELOAD = 8192,
    ALT1 = 16384,
    SCORE = 32768, // Used by client.dll for when scoreboard is held down
  }
  /** Break model material types */
  const enum BREAK {
    GLASS = 1,
    METAL = 2,
    FLESH = 4,
    WOOD = 8,
    SMOKE = 16,
    TRANS = 32,
    CONCRETE = 64,
    TYPEMASK = 79,
    _2 = 128, // Colliding temp entity sounds
  }
  /** Colliding temp entity sound types */
  const enum BOUNCE {
    SHRAP = 16,
    SHELL = 32,
    SHOTSHELL = 128, // Temp entity bounce sound types
  }
  /** Rendering modes */
  const enum kRenderMode {
    kRenderNormal = 0, // src
    kRenderTransColor = 1, // c*a+dest*(1-a)
    kRenderTransTexture = 2, // src*a+dest*(1-a)
    kRenderGlow = 3, // src*a+dest -- No Z buffer checks
    kRenderTransAlpha = 4, // src*srca+dest*(1-srca)
    kRenderTransAdd = 5, // src*a+dest
    kRenderWorldGlow = 6, // Same as kRenderGlow but not fixed size in screen space
  }
  /** Rendering effects */
  const enum kRenderFx {
    kRenderFxNone = 0,
    kRenderFxPulseSlow = 1,
    kRenderFxPulseFast = 2,
    kRenderFxPulseSlowWide = 3,
    kRenderFxPulseFastWide = 4,
    kRenderFxFadeSlow = 5,
    kRenderFxFadeFast = 6,
    kRenderFxSolidSlow = 7,
    kRenderFxSolidFast = 8,
    kRenderFxStrobeSlow = 9,
    kRenderFxStrobeFast = 10,
    kRenderFxStrobeFaster = 11,
    kRenderFxFlickerSlow = 12,
    kRenderFxFlickerFast = 13,
    kRenderFxNoDissipation = 14,
    kRenderFxDistort = 15, // Distort/scale/translate flicker
    kRenderFxHologram = 16, // kRenderFxDistort + distance fade
    kRenderFxDeadPlayer = 17, // kRenderAmt is the player index
    kRenderFxExplode = 18, // Scale up really big!
    kRenderFxGlowShell = 19, // Glowing Shell
    kRenderFxClampMinScale = 20, // Keep this sprite from getting very small (SPRITES only!)
    kRenderFxLightMultiplier = 21, // CTM !!!CZERO added to tell the studiorender that the value in iuser2 is a lightmultiplier
  }
}