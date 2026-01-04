// This file is generated automatically. Don't edit it.
declare namespace nodemod {
  // Metamod result constants
  const enum META_RES {
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

  // Message destination types for engine messaging
  const enum MSG_DEST {
    BROADCAST = 0,      // Message to all players without delivery guarantee
    ONE = 1,           // Message to one player with delivery guarantee
    ALL = 2,           // Message with delivery guarantee to all players
    INIT = 3,          // Write to the init string
    PVS = 4,           // All players in potentially visible set of point
    PAS = 5,           // All players in potentially audible set
    PVS_R = 6,         // All players in PVS with reliable delivery
    PAS_R = 7,         // All players in PAS with reliable delivery
    ONE_UNRELIABLE = 8, // Message to one player without delivery guarantee
    SPEC = 9           // Message to all HLTV proxy
  }

  // Network message types for Half-Life protocol
  const enum MSG_TYPE {
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

  // Sound attenuation constants for pfnEmitSound
  const enum ATTN {
    NONE = 0,         // No attenuation
    NORM = 0.8,       // Normal attenuation
    IDLE = 2.0,       // Idle attenuation
    STATIC = 1.25     // Static attenuation
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

  /** pev(entity, pev_button) or pev(entity, pev_oldbuttons) values */
  const enum IN_BUTTON {
    ATTACK = 1,        // 1<<0
    JUMP = 2,          // 1<<1
    DUCK = 4,          // 1<<2
    FORWARD = 8,       // 1<<3
    BACK = 16,         // 1<<4
    USE = 32,          // 1<<5
    CANCEL = 64,       // 1<<6
    LEFT = 128,        // 1<<7
    RIGHT = 256,       // 1<<8
    MOVELEFT = 512,    // 1<<9
    MOVERIGHT = 1024,  // 1<<10
    ATTACK2 = 2048,    // 1<<11
    RUN = 4096,        // 1<<12
    RELOAD = 8192,     // 1<<13
    ALT1 = 16384,      // 1<<14
    SCORE = 32768      // 1<<15 - Used by client.dll for when scoreboard is held down
  }

  /** pev(entity, pev_flags) values */
  const enum FL {
    FLY = 1,                    // 1<<0 - Changes the SV_Movestep() behavior to not need to be on ground
    SWIM = 2,                   // 1<<1 - Changes the SV_Movestep() behavior to not need to be on ground (but stay in water)
    CONVEYOR = 4,               // 1<<2
    CLIENT = 8,                 // 1<<3
    INWATER = 16,               // 1<<4
    MONSTER = 32,               // 1<<5
    GODMODE = 64,               // 1<<6
    NOTARGET = 128,             // 1<<7
    SKIPLOCALHOST = 256,        // 1<<8 - Don't send entity to local host, it's predicting this entity itself
    ONGROUND = 512,             // 1<<9 - At rest / on the ground
    PARTIALGROUND = 1024,       // 1<<10 - Not all corners are valid
    WATERJUMP = 2048,           // 1<<11 - Player jumping out of water
    FROZEN = 4096,              // 1<<12 - Player is frozen for 3rd person camera
    FAKECLIENT = 8192,          // 1<<13 - JAC: fake client, simulated server side; don't send network messages to them
    DUCKING = 16384,            // 1<<14 - Player flag -- Player is fully crouched
    FLOAT = 32768,              // 1<<15 - Apply floating force to this entity when in water
    GRAPHED = 65536,            // 1<<16 - Worldgraph has this ent listed as something that blocks a connection
    IMMUNE_WATER = 131072,      // 1<<17
    IMMUNE_SLIME = 262144,      // 1<<18
    IMMUNE_LAVA = 524288,       // 1<<19
    PROXY = 1048576,            // 1<<20 - This is a spectator proxy
    ALWAYSTHINK = 2097152,      // 1<<21 - Brush model flag -- call think every frame regardless of nextthink - ltime
    BASEVELOCITY = 4194304,     // 1<<22 - Base velocity has been applied this frame
    MONSTERCLIP = 8388608,      // 1<<23 - Only collide in with monsters who have FL_MONSTERCLIP set
    ONTRAIN = 16777216,         // 1<<24 - Player is _controlling_ a train
    WORLDBRUSH = 33554432,      // 1<<25 - Not moveable/removeable brush entity
    SPECTATOR = 67108864,       // 1<<26 - This client is a spectator
    CUSTOMENTITY = 536870912,   // 1<<29 - This is a custom entity
    KILLME = 1073741824,        // 1<<30 - This entity is marked for death
    DORMANT = 2147483648        // 1<<31 - Entity is dormant, no updates to client
  }

  /** engfunc(EngFunc_WalkMove, entity, Float:yaw, Float:dist, iMode) iMode values */
  const enum WALKMOVE {
    NORMAL = 0,     // Normal walkmove
    WORLDONLY = 1,  // Doesn't hit ANY entities, no matter what the solid type
    CHECKONLY = 2   // Move, but don't touch triggers
  }

  /** engfunc(EngFunc_MoveToOrigin, entity, Float:goal[3], Float:distance, moveType) moveType values */
  const enum MOVE {
    NORMAL = 0,  // normal move in the direction monster is facing
    STRAFE = 1   // moves in direction specified, no matter which way monster is facing
  }

  /** pev(entity, pev_movetype) values */
  const enum MOVETYPE {
    NONE = 0,           // Never moves
    WALK = 3,           // Player only - moving on the ground
    STEP = 4,           // Gravity, special edge handling -- monsters use this
    FLY = 5,            // No gravity, but still collides with stuff
    TOSS = 6,           // Gravity/Collisions
    PUSH = 7,           // No clip to world, push and crush
    NOCLIP = 8,         // No gravity, no collisions, still do velocity/avelocity
    FLYMISSILE = 9,     // Extra size to monsters
    BOUNCE = 10,        // Just like Toss, but reflect velocity when contacting surfaces
    BOUNCEMISSILE = 11, // Bounce w/o gravity
    FOLLOW = 12,        // Track movement of aiment
    PUSHSTEP = 13       // BSP model that needs physics/world collisions
  }

  /** pev(entity, pev_solid) values */
  const enum SOLID {
    NOT = 0,       // No interaction with other objects
    TRIGGER = 1,   // Touch on edge, but not blocking
    BBOX = 2,      // Touch on edge, block
    SLIDEBOX = 3,  // Touch on edge, but not an onground
    BSP = 4        // BSP clip, touch on edge, block
  }

  /** pev(entity, pev_deadflag) values */
  const enum DEAD {
    NO = 0,           // Alive
    DYING = 1,        // Playing death animation or still falling off of a ledge waiting to hit ground
    DEAD = 2,         // Dead, lying still
    RESPAWNABLE = 3,
    DISCARDBODY = 4
  }

  /** new Float:takedamage, pev(entity, pev_takedamage, takedamage) values */
  const enum DAMAGE {
    NO = 0.0,
    YES = 1.0,
    AIM = 2.0
  }

  /** pev(entity, pev_effects) values */
  const enum EF {
    BRIGHTFIELD = 1,   // Swirling cloud of particles
    MUZZLEFLASH = 2,   // Single frame ELIGHT on entity attachment 0
    BRIGHTLIGHT = 4,   // DLIGHT centered at entity origin
    DIMLIGHT = 8,      // Player flashlight
    INVLIGHT = 16,     // Get lighting from ceiling
    NOINTERP = 32,     // Don't interpolate the next frame
    LIGHT = 64,        // Rocket flare glow sprite
    NODRAW = 128       // Don't draw entity
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

  /** engfunc(EngFunc_PointContents, Float:origin) return values */
  const enum CONTENTS {
    EMPTY = -1,
    SOLID = -2,
    WATER = -3,
    SLIME = -4,
    LAVA = -5,
    SKY = -6,
    ORIGIN = -7,        // Removed at csg time
    CLIP = -8,          // Changed to contents_solid
    CURRENT_0 = -9,
    CURRENT_90 = -10,
    CURRENT_180 = -11,
    CURRENT_270 = -12,
    CURRENT_UP = -13,
    CURRENT_DOWN = -14,
    TRANSLUCENT = -15,
    LADDER = -16,
    FLYFIELD = -17,
    GRAVITY_FLYFIELD = -18,
    FOG = -19
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

  /** Ham (Hamsandwich) hook result values */
  const enum HAM_RESULT {
    UNSET = 0, // Default state
    IGNORED = 1, // Hook had no effect, continue normally
    HANDLED = 2, // Hook processed the call, but still call original
    OVERRIDE = 3, // Use hook's return value instead of original
    SUPERCEDE = 4, // Don't call original function at all
  }

  /** Ham function IDs for virtual function hooking */
  const enum HAM_FUNC {
    Spawn = 0,
    Precache = 1,
    Keyvalue = 2,
    ObjectCaps = 3,
    Activate = 4,
    SetObjectCollisionBox = 5,
    Classify = 6,
    DeathNotice = 7,
    TraceAttack = 8,
    TakeDamage = 9,
    TakeHealth = 10,
    Killed = 11,
    BloodColor = 12,
    TraceBleed = 13,
    IsTriggered = 14,
    MyMonsterPointer = 15,
    MySquadMonsterPointer = 16,
    GetToggleState = 17,
    AddPoints = 18,
    AddPointsToTeam = 19,
    AddPlayerItem = 20,
    RemovePlayerItem = 21,
    GiveAmmo = 22,
    GetDelay = 23,
    IsMoving = 24,
    OverrideReset = 25,
    DamageDecal = 26,
    SetToggleState = 27,
    StartSneaking = 28,
    StopSneaking = 29,
    OnControls = 30,
    IsSneaking = 31,
    IsAlive = 32,
    IsBSPModel = 33,
    ReflectGauss = 34,
    HasTarget = 35,
    IsInWorld = 36,
    IsPlayer = 37,
    IsNetClient = 38,
    TeamId = 39,
    GetNextTarget = 40,
    Think = 41,
    Touch = 42,
    Use = 43,
    Blocked = 44,
    Respawn = 45,
    UpdateOwner = 46,
    FBecomeProne = 47,
    Center = 48,
    EyePosition = 49,
    EarPosition = 50,
    BodyTarget = 51,
    Illumination = 52,
    FVisible = 53,
    FVecVisible = 54,
    Player_Jump = 55,
    Player_Duck = 56,
    Player_PreThink = 57,
    Player_PostThink = 58,
    Player_GetGunPosition = 59,
    Player_ShouldFadeOnDeath = 60,
    Player_ImpulseCommands = 61,
    Player_UpdateClientData = 62,
    Item_AddToPlayer = 63,
    Item_AddDuplicate = 64,
    Item_CanDeploy = 65,
    Item_Deploy = 66,
    Item_CanHolster = 67,
    Item_Holster = 68,
    Item_UpdateItemInfo = 69,
    Item_PreFrame = 70,
    Item_PostFrame = 71,
    Item_Drop = 72,
    Item_Kill = 73,
    Item_AttachToPlayer = 74,
    Item_PrimaryAmmoIndex = 75,
    Item_SecondaryAmmoIndex = 76,
    Item_UpdateClientData = 77,
    Item_GetWeaponPtr = 78,
    Item_ItemSlot = 79,
    Weapon_ExtractAmmo = 80,
    Weapon_ExtractClipAmmo = 81,
    Weapon_AddWeapon = 82,
    Weapon_PlayEmptySound = 83,
    Weapon_ResetEmptySound = 84,
    Weapon_SendWeaponAnim = 85,
    Weapon_IsUsable = 86,
    Weapon_PrimaryAttack = 87,
    Weapon_SecondaryAttack = 88,
    Weapon_Reload = 89,
    Weapon_WeaponIdle = 90,
    Weapon_RetireWeapon = 91,
    Weapon_ShouldWeaponIdle = 92,
    Weapon_UseDecrement = 93,
    TS_BreakableRespawn = 94,
    TS_CanUsedThroughWalls = 95,
    TS_RespawnWait = 96,
    CS_Restart = 97,
    CS_RoundRespawn = 98,
    CS_Item_CanDrop = 99,
    CS_Item_GetMaxSpeed = 100,
    DOD_RoundRespawn = 101,
    DOD_RoundRespawnEnt = 102,
    DOD_RoundStore = 103,
    DOD_AreaSetIndex = 104,
    DOD_AreaSendStatus = 105,
    DOD_GetState = 106,
    DOD_GetStateEnt = 107,
    DOD_Item_CanDrop = 108,
    TFC_EngineerUse = 109,
    TFC_Finished = 110,
    TFC_EmpExplode = 111,
    TFC_CalcEmpDmgRad = 112,
    TFC_TakeEmpBlast = 113,
    TFC_EmpRemove = 114,
    TFC_TakeConcussionBlast = 115,
    TFC_Concuss = 116,
    ESF_IsEnvModel = 117,
    ESF_TakeDamage2 = 118,
    NS_GetPointValue = 119,
    NS_AwardKill = 120,
    NS_ResetEntity = 121,
    NS_UpdateOnRemove = 122,
    TS_GiveSlowMul = 123,
    TS_GoSlow = 124,
    TS_InSlow = 125,
    TS_IsObjective = 126,
    TS_EnableObjective = 127,
    TS_OnFreeEntPrivateData = 128,
    TS_ShouldCollide = 129,
    ChangeYaw = 130,
    HasHumanGibs = 131,
    HasAlienGibs = 132,
    FadeMonster = 133,
    GibMonster = 134,
    BecomeDead = 135,
    IRelationship = 136,
    PainSound = 137,
    ReportAIState = 138,
    MonsterInitDead = 139,
    Look = 140,
    BestVisibleEnemy = 141,
    FInViewCone = 142,
    FVecInViewCone = 143,
    GetDeathActivity = 144,
    RunAI = 145,
    MonsterThink = 146,
    MonsterInit = 147,
    CheckLocalMove = 148,
    Move = 149,
    MoveExecute = 150,
    ShouldAdvanceRoute = 151,
    GetStoppedActivity = 152,
    Stop = 153,
    CheckRangeAttack1 = 154,
    CheckRangeAttack2 = 155,
    CheckMeleeAttack1 = 156,
    CheckMeleeAttack2 = 157,
    ScheduleChange = 158,
    CanPlaySequence = 159,
    CanPlaySentence2 = 160,
    PlaySentence = 161,
    PlayScriptedSentence = 162,
    SentenceStop = 163,
    GetIdealState = 164,
    SetActivity = 165,
    CheckEnemy = 166,
    FTriangulate = 167,
    SetYawSpeed = 168,
    BuildNearestRoute = 169,
    FindCover = 170,
    CoverRadius = 171,
    FCanCheckAttacks = 172,
    CheckAmmo = 173,
    IgnoreConditions = 174,
    FValidateHintType = 175,
    FCanActiveIdle = 176,
    ISoundMask = 177,
    HearingSensitivity = 178,
    BarnacleVictimBitten = 179,
    BarnacleVictimReleased = 180,
    PrescheduleThink = 181,
    DeathSound = 182,
    AlertSound = 183,
    IdleSound = 184,
    StopFollowing = 185,
    CS_Weapon_SendWeaponAnim = 186,
    CS_Player_ResetMaxSpeed = 187,
    CS_Player_IsBot = 188,
    CS_Player_GetAutoaimVector = 189,
    CS_Player_Blind = 190,
    CS_Player_OnTouchingWeapon = 191,
    DOD_SetScriptReset = 192,
    DOD_Item_SpawnDeploy = 193,
    DOD_Item_SetDmgTime = 194,
    DOD_Item_DropGren = 195,
    DOD_Weapon_IsUseable = 196,
    DOD_Weapon_Aim = 197,
    DOD_Weapon_flAim = 198,
    DOD_Weapon_RemoveStamina = 199,
    DOD_Weapon_ChangeFOV = 200,
    DOD_Weapon_ZoomOut = 201,
    DOD_Weapon_ZoomIn = 202,
    DOD_Weapon_GetFOV = 203,
    DOD_Weapon_IsWaterSniping = 204,
    DOD_Weapon_UpdateZoomSpeed = 205,
    DOD_Weapon_Special = 206,
    TFC_DB_GetItemName = 207,
    TFC_RadiusDamage = 208,
    TFC_RadiusDamage2 = 209,
    ESF_IsFighter = 210,
    ESF_IsBuddy = 211,
    ESF_EmitSound = 212,
    ESF_EmitNullSound = 213,
    ESF_IncreaseStrength = 214,
    ESF_IncreasePL = 215,
    ESF_SetPowerLevel = 216,
    ESF_SetMaxPowerLevel = 217,
    ESF_StopAniTrigger = 218,
    ESF_StopFly = 219,
    ESF_HideWeapon = 220,
    ESF_ClientRemoveWeapon = 221,
    ESF_SendClientsCustomModel = 222,
    ESF_CanTurbo = 223,
    ESF_CanPrimaryFire = 224,
    ESF_CanSecondaryFire = 225,
    ESF_CanStopFly = 226,
    ESF_CanBlock = 227,
    ESF_CanRaiseKi = 228,
    ESF_CanRaiseStamina = 229,
    ESF_CanTeleport = 230,
    ESF_CanStartFly = 231,
    ESF_CanStartPowerup = 232,
    ESF_CanJump = 233,
    ESF_CanWallJump = 234,
    ESF_IsSuperJump = 235,
    ESF_IsMoveBack = 236,
    ESF_CheckWallJump = 237,
    ESF_EnableWallJump = 238,
    ESF_DisableWallJump = 239,
    ESF_ResetWallJumpVars = 240,
    ESF_GetWallJumpAnim = 241,
    ESF_GetWallJumpAnim2 = 242,
    ESF_SetWallJumpAnimation = 243,
    ESF_SetFlyMoveType = 244,
    ESF_IsFlyMoveType = 245,
    ESF_IsWalkMoveType = 246,
    ESF_SetWalkMoveType = 247,
    ESF_DrawChargeBar = 248,
    ESF_StartBlock = 249,
    ESF_StopBlock = 250,
    ESF_StartFly = 251,
    ESF_GetMaxSpeed = 252,
    ESF_SetAnimation = 253,
    ESF_PlayAnimation = 254,
    ESF_GetMoveForward = 255,
    ESF_GetMoveRight = 256,
    ESF_GetMoveUp = 257,
    ESF_AddBlindFX = 258,
    ESF_RemoveBlindFX = 259,
    ESF_DisablePSBar = 260,
    ESF_AddBeamBoxCrosshair = 261,
    ESF_RemoveBeamBoxCrosshair = 262,
    ESF_DrawPSWinBonus = 263,
    ESF_DrawPSBar = 264,
    ESF_LockCrosshair = 265,
    ESF_UnLockCrosshair = 266,
    ESF_RotateCrosshair = 267,
    ESF_UnRotateCrosshair = 268,
    ESF_WaterMove = 269,
    ESF_CheckTimeBasedDamage = 270,
    ESF_DoesSecondaryAttack = 271,
    ESF_DoesPrimaryAttack = 272,
    ESF_RemoveSpecialModes = 273,
    ESF_StopTurbo = 274,
    ESF_TakeBean = 275,
    ESF_GetPowerLevel = 276,
    ESF_RemoveAllOtherWeapons = 277,
    ESF_StopSwoop = 278,
    ESF_SetDeathAnimation = 279,
    ESF_SetModel = 280,
    ESF_AddAttacks = 281,
    ESF_EmitClassSound = 282,
    ESF_CheckLightning = 283,
    ESF_FreezeControls = 284,
    ESF_UnFreezeControls = 285,
    ESF_UpdateKi = 286,
    ESF_UpdateHealth = 287,
    ESF_GetTeleportDir = 288,
    ESF_Weapon_HolsterWhenMeleed = 289,
    NS_SetBoneController = 290,
    NS_SaveDataForReset = 291,
    NS_GetHull = 292,
    NS_GetMaxWalkSpeed = 293,
    NS_SetTeamID = 294,
    NS_GetEffectivePlayerClass = 295,
    NS_GetAuthenticationMask = 296,
    NS_EffectivePlayerClassChanged = 297,
    NS_NeedsTeamUpdate = 298,
    NS_SendTeamUpdate = 299,
    NS_SendWeaponUpdate = 300,
    NS_InitPlayerFromSpawn = 301,
    NS_PackDeadPlayerItems = 302,
    NS_GetAnimationForActivity = 303,
    NS_StartObserver = 304,
    NS_StopObserver = 305,
    NS_GetAdrenalineFactor = 306,
    NS_GetNamedItem = 307,
    NS_Suicide = 308,
    NS_GetCanUseWeapon = 309,
    NS_Weapon_GetWeapPrimeTime = 310,
    NS_Weapon_PrimeWeapon = 311,
    NS_Weapon_GetIsWeaponPrimed = 312,
    NS_Weapon_GetIsWeaponPriming = 313,
    NS_Weapon_DefaultDeploy = 314,
    NS_Weapon_DefaultReload = 315,
    NS_Weapon_GetDeployTime = 316,
    SC_GetClassification = 317,
    SC_IsMonster = 318,
    SC_IsPhysX = 319,
    SC_IsPointEntity = 320,
    SC_IsMachine = 321,
    SC_CriticalRemove = 322,
    SC_UpdateOnRemove = 323,
    SC_FVisible = 324,
    SC_FVisibleFromPos = 325,
    SC_IsFacings = 326,
    SC_GetPointsForDamage = 327,
    SC_GetDamagePoints = 328,
    SC_OnCreate = 329,
    SC_OnDestroy = 330,
    SC_IsValidEntity = 331,
    SC_ShouldFadeOnDeath = 332,
    SC_SetupFriendly = 333,
    SC_ReviveThink = 334,
    SC_Revive = 335,
    SC_StartMonster = 336,
    SC_CheckRangeAttack1_Move = 337,
    SC_CheckRangeAttack2_Move = 338,
    SC_CheckMeleeAttack1_Move = 339,
    SC_CheckMeleeAttack2_Move = 340,
    SC_CheckTankUsage = 341,
    SC_SetGaitActivity = 342,
    SC_FTriangulate = 343,
    SC_FTriangulateExtension = 344,
    SC_FindCoverGrenade = 345,
    SC_FindCoverDistance = 346,
    SC_FindAttackPoint = 347,
    SC_FValidateCover = 348,
    SC_NoFriendlyFire1 = 349,
    SC_NoFriendlyFire2 = 350,
    SC_NoFriendlyFire3 = 351,
    SC_NoFriendlyFireToPos = 352,
    SC_FVisibleGunPos = 353,
    SC_FInBulletCone = 354,
    SC_CallGibMonster = 355,
    SC_CheckTimeBasedDamage = 356,
    SC_IsMoving = 357,
    SC_IsPlayerFollowing = 358,
    SC_StartPlayerFollowing = 359,
    SC_StopPlayerFollowing = 360,
    SC_UseSound = 361,
    SC_UnUseSound = 362,
    SC_RideMonster = 363,
    SC_CheckApplyGenericAttacks = 364,
    SC_CheckScared = 365,
    SC_CheckCreatureDanger = 366,
    SC_CheckFallDamage = 367,
    SC_CheckRevival = 368,
    SC_MedicCallSound = 369,
    SC_Player_MenuInputPerformed = 370,
    SC_Player_IsMenuInputDone = 371,
    SC_Player_SpecialSpawn = 372,
    SC_Player_IsValidInfoEntity = 373,
    SC_Player_LevelEnd = 374,
    SC_Player_VoteStarted = 375,
    SC_Player_CanStartNextVote = 376,
    SC_Player_Vote = 377,
    SC_Player_HasVoted = 378,
    SC_Player_ResetVote = 379,
    SC_Player_LastVoteInput = 380,
    SC_Player_InitVote = 381,
    SC_Player_TimeToStartNextVote = 382,
    SC_Player_ResetView = 383,
    SC_Player_GetLogFrequency = 384,
    SC_Player_LogPlayerStats = 385,
    SC_Player_DisableCollisionWithPlayer = 386,
    SC_Player_EnableCollisionWithPlayer = 387,
    SC_Player_CanTouchPlayer = 388,
    SC_Item_Materialize = 389,
    SC_Weapon_BulletAccuracy = 390,
    SC_Weapon_TertiaryAttack = 391,
    SC_Weapon_BurstSupplement = 392,
    SC_Weapon_GetP_Model = 393,
    SC_Weapon_GetW_Model = 394,
    SC_Weapon_GetV_Model = 395,
    SC_Weapon_PrecacheCustomModels = 396,
    SC_Weapon_IsMultiplayer = 397,
    SC_Weapon_FRunfuncs = 398,
    SC_Weapon_SetFOV = 399,
    SC_Weapon_FCanRun = 400,
    SC_Weapon_CustomDecrement = 401,
    SC_Weapon_SetV_Model = 402,
    SC_Weapon_SetP_Model = 403,
    SC_Weapon_ChangeWeaponSkin = 404,
    TFC_Killed = 405,
    TFC_IsTriggered = 406,
    TFC_Weapon_SendWeaponAnim = 407,
    TFC_Weapon_GetNextAttackDelay = 408,
    SC_TakeHealth = 409,
    SC_TakeArmor = 410,
    SC_GiveAmmo = 411,
    SC_CheckAttacker = 412,
    SC_Player_IsConnected = 413,
    DOD_Weapon_SendWeaponAnim = 414,
    CS_Item_IsWeapon = 415,
    OPF_MySquadTalkMonsterPointer = 416,
    OPF_WeaponTimeBase = 417,
    TS_Weapon_AlternateAttack = 418,
    Item_GetItemInfo = 419,
    SC_PreSpawn = 420,
    SC_PostSpawn = 421,
    SC_OnKeyValueUpdate = 422,
    SC_SetClassification = 423,
    SC_IsTriggered = 424,
    SC_MyCustomPointer = 425,
    SC_MyItemPointer = 426,
    SC_AddPoints = 427,
    SC_AddPointsToTeam = 428,
    SC_RemovePlayerItem = 429,
    SC_OnControls = 430,
    SC_IsSneaking = 431,
    SC_IsAlive = 432,
    SC_IsBSPModel = 433,
    SC_ReflectGauss = 434,
    SC_HasTarget = 435,
    SC_IsInWorld = 436,
    SC_IsPlayer = 437,
    SC_IsNetClient = 438,
    SC_IsBreakable = 439,
    SC_SUB_UseTargets = 440,
    SC_IsLockedByMaster = 441,
    SC_FBecomeProne = 442,
    SC_FVecVisible = 443,
    SC_SetPlayerAlly = 444,
    SC_OnSetOriginByMap = 445,
    SC_IsRevivable = 446,
    SC_BeginRevive = 447,
    SC_EndRevive = 448,
    SC_CanPlaySequence = 449,
    SC_CanPlaySentence2 = 450,
    SC_PlayScriptedSentence = 451,
    SC_Item_AddToPlayer = 452,
    SC_Item_AddDuplicate = 453,
    SC_Item_AddAmmoFromItem = 454,
    SC_Item_GetPickupSound = 455,
    SC_Item_CanCollect = 456,
    SC_Item_Collect = 457,
    SC_Item_GetItemInfo = 458,
    SC_Item_CanDeploy = 459,
    SC_Item_Deploy = 460,
    SC_Item_CanHolster = 461,
    SC_Item_InactiveItemPreFrame = 462,
    SC_Item_InactiveItemPostFrame = 463,
    SC_Item_DetachFromPlayer = 464,
    SC_Item_UpdateClientData = 465,
    SC_Item_GetRespawnTime = 466,
    SC_Item_CanHaveDuplicates = 467,
    SC_Weapon_ExtractAmmoFromItem = 468,
    SC_Weapon_AddWeapon = 469,
    SC_Weapon_GetAmmo1Drop = 470,
    SC_Weapon_GetAmmo2Drop = 471,
    SC_Weapon_PlayEmptySound = 472,
    SC_Weapon_IsUsable = 473,
    SC_Weapon_FinishReload = 474,
    SC_Weapon_ShouldReload = 475,
    SC_Weapon_ShouldWeaponIdle = 476,
    SC_Weapon_UseDecrement = 477,
    SC_Player_EnteredObserver = 478,
    SC_Player_LeftObserver = 479,
    SC_Player_IsObserver = 480,
  }
}