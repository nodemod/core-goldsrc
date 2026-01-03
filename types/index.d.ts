// This file is generated automatically. Don't edit it.
/// <reference path="./enums.d.ts" />
/// <reference path="./events.d.ts" />
/// <reference path="./structures.d.ts" />
/// <reference path="./engine.d.ts" />
/// <reference path="./dll.d.ts" />

// Global Entity constructor
declare class Entity {
  /**
   * Creates a new named entity with proper initialization
   * @param classname - Entity classname (e.g. "weapon_ak47", "info_player_start")
   */
  constructor(classname: string);
}

declare namespace nodemod {
  // Properties
  const cwd: string;
  const gameDir: string;
  const players: Entity[];
  const mapname: string;
  const time: number;
  const frametime: number;

  // Event system functions
  function on<T extends keyof EventCallbacks>(eventName: T, callback: EventCallbacks[T]): void;
  function addEventListener<T extends keyof EventCallbacks>(eventName: T, callback: EventCallbacks[T]): void;
  function addListener<T extends keyof EventCallbacks>(eventName: T, callback: EventCallbacks[T]): void;
  function removeListener<T extends keyof EventCallbacks>(eventName: T, callback: EventCallbacks[T]): void;
  function removeEventListener<T extends keyof EventCallbacks>(eventName: T, callback: EventCallbacks[T]): void;
  function clearListeners(eventName?: keyof EventCallbacks): void;
  function fire<T extends keyof EventCallbacks>(eventName: T, ...args: Parameters<EventCallbacks[T]>): void;

  // Utility functions
  function getUserMsgId(msgName: string): number;
  function getUserMsgName(msgId: number): string;
  function setMetaResult(result: META_RES): void;
  function getMetaResult(): META_RES;
  function continueServer(): void;

  // Ham callback type mappings - maps HAM_FUNC to callback signature
  // All callbacks receive 'this_' (the hooked entity) as the first parameter
  type HamCallbackFor<T extends HAM_FUNC> =
    T extends HAM_FUNC.Spawn ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Precache ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Keyvalue ? (this_: Entity, str: string) => HAM_RESULT | void :
    T extends HAM_FUNC.ObjectCaps ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Activate ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SetObjectCollisionBox ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Classify ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DeathNotice ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TraceAttack ? (this_: Entity, attacker: Entvars, damage: number, direction: number[], trace: TraceResult, damageBits: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TakeDamage ? (this_: Entity, inflictor: Entvars, attacker: Entvars, damage: number, damageBits: number) => HAM_RESULT | number :
    T extends HAM_FUNC.TakeHealth ? (this_: Entity, value: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.Killed ? (this_: Entity, attacker: Entvars, gibType: number) => HAM_RESULT | void :
    T extends HAM_FUNC.BloodColor ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TraceBleed ? (this_: Entity, damage: number, direction: number[], trace: TraceResult) => HAM_RESULT | void :
    T extends HAM_FUNC.IsTriggered ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.MyMonsterPointer ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.MySquadMonsterPointer ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.GetToggleState ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.AddPoints ? (this_: Entity, score: number, allowNegative: number) => HAM_RESULT | void :
    T extends HAM_FUNC.AddPointsToTeam ? (this_: Entity, score: number, allowNegative: number) => HAM_RESULT | void :
    T extends HAM_FUNC.AddPlayerItem ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.RemovePlayerItem ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.GiveAmmo ? (this_: Entity, amount: number, name: string, max: number) => HAM_RESULT | number :
    T extends HAM_FUNC.GetDelay ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.IsMoving ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.OverrideReset ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DamageDecal ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SetToggleState ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.StartSneaking ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.StopSneaking ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.OnControls ? (this_: Entity, other: Entvars) => HAM_RESULT | number :
    T extends HAM_FUNC.IsSneaking ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.IsAlive ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.IsBSPModel ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ReflectGauss ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.HasTarget ? (this_: Entity, str: string) => HAM_RESULT | number :
    T extends HAM_FUNC.IsInWorld ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.IsPlayer ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.IsNetClient ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TeamId ? (this_: Entity) => HAM_RESULT | string :
    T extends HAM_FUNC.GetNextTarget ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.Think ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Touch ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Use ? (this_: Entity, activator: Entity, caller: Entity, useType: number, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.Blocked ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Respawn ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.UpdateOwner ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.FBecomeProne ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Center ? (this_: Entity) => HAM_RESULT | number[] :
    T extends HAM_FUNC.EyePosition ? (this_: Entity) => HAM_RESULT | number[] :
    T extends HAM_FUNC.EarPosition ? (this_: Entity) => HAM_RESULT | number[] :
    T extends HAM_FUNC.BodyTarget ? (this_: Entity, vec: number[]) => HAM_RESULT | number[] :
    T extends HAM_FUNC.Illumination ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FVisible ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FVecVisible ? (this_: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.Player_Jump ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Player_Duck ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Player_PreThink ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Player_PostThink ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Player_GetGunPosition ? (this_: Entity) => HAM_RESULT | number[] :
    T extends HAM_FUNC.Player_ShouldFadeOnDeath ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Player_ImpulseCommands ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Player_UpdateClientData ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_AddToPlayer ? (this_: Entity, player: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_AddDuplicate ? (this_: Entity, original: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_CanDeploy ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_Deploy ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_CanHolster ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_Holster ? (this_: Entity, skipLocal: number) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_UpdateItemInfo ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_PreFrame ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_PostFrame ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_Drop ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_Kill ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_AttachToPlayer ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_PrimaryAmmoIndex ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_SecondaryAmmoIndex ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_UpdateClientData ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Item_GetWeaponPtr ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.Item_ItemSlot ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_ExtractAmmo ? (this_: Entity, weapon: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_ExtractClipAmmo ? (this_: Entity, weapon: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_AddWeapon ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_PlayEmptySound ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_ResetEmptySound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_SendWeaponAnim ? (this_: Entity, value1: number, value2: number, value3: number) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_IsUsable ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_PrimaryAttack ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_SecondaryAttack ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_Reload ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_WeaponIdle ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_RetireWeapon ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Weapon_ShouldWeaponIdle ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Weapon_UseDecrement ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TS_BreakableRespawn ? (this_: Entity, respawnTime: number) => HAM_RESULT | number :
    T extends HAM_FUNC.TS_CanUsedThroughWalls ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TS_RespawnWait ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Restart ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_RoundRespawn ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Item_CanDrop ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.CS_Item_GetMaxSpeed ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_RoundRespawn ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_RoundRespawnEnt ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_RoundStore ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_AreaSetIndex ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_AreaSendStatus ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_GetState ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_GetStateEnt ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Item_CanDrop ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TFC_EngineerUse ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TFC_Finished ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_EmpExplode ? (this_: Entity, other: Entvars, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_CalcEmpDmgRad ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_TakeEmpBlast ? (this_: Entity, other: Entvars) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_EmpRemove ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_TakeConcussionBlast ? (this_: Entity, other: Entvars, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_Concuss ? (this_: Entity, other: Entvars) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_IsEnvModel ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_TakeDamage2 ? (this_: Entity, other1: Entvars, other2: Entvars, value1: number, value2: number, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_GetPointValue ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_AwardKill ? (this_: Entity, other: Entvars) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_ResetEntity ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_UpdateOnRemove ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TS_GiveSlowMul ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TS_GoSlow ? (this_: Entity, duration: number, mode: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TS_InSlow ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TS_IsObjective ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TS_EnableObjective ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TS_OnFreeEntPrivateData ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TS_ShouldCollide ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ChangeYaw ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.HasHumanGibs ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.HasAlienGibs ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FadeMonster ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.GibMonster ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.BecomeDead ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.IRelationship ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.PainSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ReportAIState ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.MonsterInitDead ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Look ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.BestVisibleEnemy ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.FInViewCone ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FVecInViewCone ? (this_: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.GetDeathActivity ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.RunAI ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.MonsterThink ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.MonsterInit ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CheckLocalMove ? (this_: Entity, vec1: number[], vec2: number[], other: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.Move ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.MoveExecute ? (this_: Entity, other: Entity, vec: number[], value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ShouldAdvanceRoute ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.GetStoppedActivity ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.Stop ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CheckRangeAttack1 ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.CheckRangeAttack2 ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.CheckMeleeAttack1 ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.CheckMeleeAttack2 ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.ScheduleChange ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CanPlaySequence ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.CanPlaySentence2 ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.PlaySentence ? (this_: Entity, str: string, value1: number, value2: number, value3: number) => HAM_RESULT | void :
    T extends HAM_FUNC.PlayScriptedSentence ? (this_: Entity, str: string, value1: number, value2: number, value3: number, value: number, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SentenceStop ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.GetIdealState ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SetActivity ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.CheckEnemy ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FTriangulate ? (this_: Entity, vec1: number[], vec2: number[], value: number, other: Entity, vec3: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SetYawSpeed ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.BuildNearestRoute ? (this_: Entity, vec1: number[], vec2: number[], value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.FindCover ? (this_: Entity, vec1: number[], vec2: number[], value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.CoverRadius ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FCanCheckAttacks ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.CheckAmmo ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.IgnoreConditions ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.FValidateHintType ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.FCanActiveIdle ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ISoundMask ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.HearingSensitivity ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.BarnacleVictimBitten ? (this_: Entity, other: Entvars) => HAM_RESULT | void :
    T extends HAM_FUNC.BarnacleVictimReleased ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.PrescheduleThink ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DeathSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.AlertSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.IdleSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.StopFollowing ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Weapon_SendWeaponAnim ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Player_ResetMaxSpeed ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Player_IsBot ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.CS_Player_GetAutoaimVector ? (this_: Entity, value: number) => HAM_RESULT | number[] :
    T extends HAM_FUNC.CS_Player_Blind ? (this_: Entity, value1: number, value2: number, value3: number, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Player_OnTouchingWeapon ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_SetScriptReset ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_Item_SpawnDeploy ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Item_SetDmgTime ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_Item_DropGren ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_Weapon_IsUseable ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_Aim ? (this_: Entity, value: number, other: Entity, value2: number) => HAM_RESULT | number[] :
    T extends HAM_FUNC.DOD_Weapon_flAim ? (this_: Entity, value: number, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_RemoveStamina ? (this_: Entity, value: number, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_Weapon_ChangeFOV ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_ZoomOut ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_ZoomIn ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_GetFOV ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_IsWaterSniping ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_UpdateZoomSpeed ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.DOD_Weapon_Special ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_DB_GetItemName ? (this_: Entity) => HAM_RESULT | string :
    T extends HAM_FUNC.TFC_RadiusDamage ? (this_: Entity, other1: Entvars, other2: Entvars, value: number, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_RadiusDamage2 ? (this_: Entity, vec: number[], other1: Entvars, other2: Entvars, value: number, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_IsFighter ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_IsBuddy ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_EmitSound ? (this_: Entity, str: string, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_EmitNullSound ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_IncreaseStrength ? (this_: Entity, other: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_IncreasePL ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_SetPowerLevel ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_SetMaxPowerLevel ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StopAniTrigger ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StopFly ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_HideWeapon ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_ClientRemoveWeapon ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_SendClientsCustomModel ? (this_: Entity, str: string) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_CanTurbo ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanPrimaryFire ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanSecondaryFire ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanStopFly ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanBlock ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanRaiseKi ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanRaiseStamina ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanTeleport ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanStartFly ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanStartPowerup ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanJump ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CanWallJump ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_IsSuperJump ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_IsMoveBack ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_CheckWallJump ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_EnableWallJump ? (this_: Entity, vec: number[]) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_DisableWallJump ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_ResetWallJumpVars ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_GetWallJumpAnim ? (this_: Entity, str1: string, vec: number[], str2: string) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_GetWallJumpAnim2 ? (this_: Entity, str1: string, str2: string) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_SetWallJumpAnimation ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_SetFlyMoveType ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_IsFlyMoveType ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_IsWalkMoveType ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_SetWalkMoveType ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_DrawChargeBar ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StartBlock ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StopBlock ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StartFly ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_GetMaxSpeed ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_SetAnimation ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_PlayAnimation ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_GetMoveForward ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_GetMoveRight ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_GetMoveUp ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_AddBlindFX ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_RemoveBlindFX ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_DisablePSBar ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_AddBeamBoxCrosshair ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_RemoveBeamBoxCrosshair ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_DrawPSWinBonus ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_DrawPSBar ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_LockCrosshair ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_UnLockCrosshair ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_RotateCrosshair ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_UnRotateCrosshair ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_WaterMove ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_CheckTimeBasedDamage ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_DoesSecondaryAttack ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_DoesPrimaryAttack ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.ESF_RemoveSpecialModes ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StopTurbo ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_TakeBean ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_GetPowerLevel ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_RemoveAllOtherWeapons ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_StopSwoop ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_SetDeathAnimation ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_SetModel ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_AddAttacks ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_EmitClassSound ? (this_: Entity, str1: string, str2: string, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_CheckLightning ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_FreezeControls ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_UnFreezeControls ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_UpdateKi ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_UpdateHealth ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.ESF_GetTeleportDir ? (this_: Entity) => HAM_RESULT | number[] :
    T extends HAM_FUNC.ESF_Weapon_HolsterWhenMeleed ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_SetBoneController ? (this_: Entity, value: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_SaveDataForReset ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_GetHull ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_GetMaxWalkSpeed ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_SetTeamID ? (this_: Entity, str: string) => HAM_RESULT | string :
    T extends HAM_FUNC.NS_GetEffectivePlayerClass ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_GetAuthenticationMask ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_EffectivePlayerClassChanged ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_NeedsTeamUpdate ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_SendTeamUpdate ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_SendWeaponUpdate ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_InitPlayerFromSpawn ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_PackDeadPlayerItems ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_GetAnimationForActivity ? (this_: Entity, value1: number, str: string, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_StartObserver ? (this_: Entity, vec1: number[], vec2: number[]) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_StopObserver ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_GetAdrenalineFactor ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_GetNamedItem ? (this_: Entity, str: string, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_Suicide ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_GetCanUseWeapon ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_Weapon_GetWeapPrimeTime ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_Weapon_PrimeWeapon ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.NS_Weapon_GetIsWeaponPrimed ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_Weapon_GetIsWeaponPriming ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_Weapon_DefaultDeploy ? (this_: Entity, str1: string, str2: string, value1: number, str3: string, value2: number, value3: number) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_Weapon_DefaultReload ? (this_: Entity, value1: number, value2: number, value: number, value3: number) => HAM_RESULT | number :
    T extends HAM_FUNC.NS_Weapon_GetDeployTime ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_GetClassification ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsMonster ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsPhysX ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_IsPointEntity ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsMachine ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CriticalRemove ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_UpdateOnRemove ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_FVisible ? (this_: Entity, other: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FVisibleFromPos ? (this_: Entity, vec1: number[], vec2: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsFacings ? (this_: Entity, other: Entvars, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_GetPointsForDamage ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_GetDamagePoints ? (this_: Entity, other1: Entvars, other2: Entvars, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_OnCreate ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_OnDestroy ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_IsValidEntity ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_ShouldFadeOnDeath ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_SetupFriendly ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_ReviveThink ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Revive ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_StartMonster ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CheckRangeAttack1_Move ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CheckRangeAttack2_Move ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CheckMeleeAttack1_Move ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CheckMeleeAttack2_Move ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CheckTankUsage ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_SetGaitActivity ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FTriangulate ? (this_: Entity, vec1: number[], vec2: number[], value: number, other: Entity, vec3: number[], vec4: number[], value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FTriangulateExtension ? (this_: Entity, vec1: number[], vec2: number[], value: number, other: Entity, vec3: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FindCoverGrenade ? (this_: Entity, vec1: number[], vec2: number[], value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FindCoverDistance ? (this_: Entity, vec1: number[], vec2: number[], value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FindAttackPoint ? (this_: Entity, vec1: number[], vec2: number[], value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FValidateCover ? (this_: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_NoFriendlyFire1 ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_NoFriendlyFire2 ? (this_: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_NoFriendlyFire3 ? (this_: Entity, vec: number[], other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_NoFriendlyFireToPos ? (this_: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FVisibleGunPos ? (this_: Entity, other: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FInBulletCone ? (this_: Entity, other: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CallGibMonster ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CheckTimeBasedDamage ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_IsMoving ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsPlayerFollowing ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_StartPlayerFollowing ? (this_: Entity, other: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_StopPlayerFollowing ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_UseSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_UnUseSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_RideMonster ? (this_: Entity, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CheckApplyGenericAttacks ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CheckScared ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CheckCreatureDanger ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CheckFallDamage ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CheckRevival ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_MedicCallSound ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_MenuInputPerformed ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_IsMenuInputDone ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_SpecialSpawn ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_IsValidInfoEntity ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_LevelEnd ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_VoteStarted ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_CanStartNextVote ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_Vote ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_HasVoted ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_ResetVote ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_LastVoteInput ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_InitVote ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_TimeToStartNextVote ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_ResetView ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_GetLogFrequency ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_LogPlayerStats ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_DisableCollisionWithPlayer ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_EnableCollisionWithPlayer ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_CanTouchPlayer ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Item_Materialize ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_BulletAccuracy ? (this_: Entity, vec1: number[], vec2: number[], vec3: number[], vec4: number[]) => HAM_RESULT | number[] :
    T extends HAM_FUNC.SC_Weapon_TertiaryAttack ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_BurstSupplement ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_GetP_Model ? (this_: Entity, str: string) => HAM_RESULT | string :
    T extends HAM_FUNC.SC_Weapon_GetW_Model ? (this_: Entity, str: string) => HAM_RESULT | string :
    T extends HAM_FUNC.SC_Weapon_GetV_Model ? (this_: Entity, str: string) => HAM_RESULT | string :
    T extends HAM_FUNC.SC_Weapon_PrecacheCustomModels ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_IsMultiplayer ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_FRunfuncs ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_SetFOV ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_FCanRun ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_CustomDecrement ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_SetV_Model ? (this_: Entity, str: string) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_SetP_Model ? (this_: Entity, str: string) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_ChangeWeaponSkin ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_Killed ? (this_: Entity, other1: Entvars, other2: Entvars, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_IsTriggered ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TFC_Weapon_SendWeaponAnim ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.TFC_Weapon_GetNextAttackDelay ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_TakeHealth ? (this_: Entity, value: number, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_TakeArmor ? (this_: Entity, value: number, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_GiveAmmo ? (this_: Entity, value1: number, str: string, value2: number, value3: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CheckAttacker ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_IsConnected ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.DOD_Weapon_SendWeaponAnim ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.CS_Item_IsWeapon ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.OPF_MySquadTalkMonsterPointer ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.OPF_WeaponTimeBase ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.TS_Weapon_AlternateAttack ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.Item_GetItemInfo ? (this_: Entity, itemInfo: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_PreSpawn ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_PostSpawn ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_OnKeyValueUpdate ? (this_: Entity, str: string) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_SetClassification ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_IsTriggered ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_MyCustomPointer ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.SC_MyItemPointer ? (this_: Entity) => HAM_RESULT | Entity :
    T extends HAM_FUNC.SC_AddPoints ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_AddPointsToTeam ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_RemovePlayerItem ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_OnControls ? (this_: Entity, other: Entvars) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsSneaking ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsAlive ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsBSPModel ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_ReflectGauss ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_HasTarget ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsInWorld ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsPlayer ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsNetClient ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_IsBreakable ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_SUB_UseTargets ? (this_: Entity, other: Entity, value: number, value2: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_IsLockedByMaster ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FBecomeProne ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_FVecVisible ? (this_: Entity, vec: number[]) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_SetPlayerAlly ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_OnSetOriginByMap ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_IsRevivable ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_BeginRevive ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_EndRevive ? (this_: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_CanPlaySequence ? (this_: Entity, value1: number, value2: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_CanPlaySentence2 ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_PlayScriptedSentence ? (this_: Entity, str: string, value1: number, value2: number, value3: number, value: number, other: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Item_AddToPlayer ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_AddDuplicate ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_AddAmmoFromItem ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_GetPickupSound ? (this_: Entity) => HAM_RESULT | string :
    T extends HAM_FUNC.SC_Item_CanCollect ? (this_: Entity, other: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_Collect ? (this_: Entity, other: Entity, value: number) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Item_GetItemInfo ? (this_: Entity, value: number) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_CanDeploy ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_Deploy ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_CanHolster ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_InactiveItemPreFrame ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Item_InactiveItemPostFrame ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Item_DetachFromPlayer ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Item_UpdateClientData ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_GetRespawnTime ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Item_CanHaveDuplicates ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_ExtractAmmoFromItem ? (this_: Entity, other: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_AddWeapon ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_GetAmmo1Drop ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_GetAmmo2Drop ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_PlayEmptySound ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_IsUsable ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_FinishReload ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Weapon_ShouldReload ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_ShouldWeaponIdle ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Weapon_UseDecrement ? (this_: Entity) => HAM_RESULT | number :
    T extends HAM_FUNC.SC_Player_EnteredObserver ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_LeftObserver ? (this_: Entity) => HAM_RESULT | void :
    T extends HAM_FUNC.SC_Player_IsObserver ? (this_: Entity) => HAM_RESULT | number :
    (this_: Entity, ...args: any[]) => HAM_RESULT | void;

  // Ham (Hamsandwich) virtual function hooking
  interface Ham {
    /** Register a ham hook on an entity class's virtual function with typed callback */
    register<F extends HAM_FUNC>(functionId: F, entityClass: string, callback: HamCallbackFor<F>, isPre: boolean): number;
    /** Unregister a ham hook by ID */
    unregister(hookId: number): void;
    /** Set the return value for the hooked function */
    setReturn(value: any): void;
    /** Get the current return value */
    getReturn(): any;
    /** Get the original return value */
    getOrigReturn(): any;
    /** Set result to SUPERCEDE (skip original function) */
    supercede(): void;
    /** Set result to OVERRIDE (use hook's return value) */
    override(): void;
    /** Set result to HANDLED (original still executes) */
    handled(): void;
    /** Set result to IGNORED (no effect) */
    ignored(): void;
    /** Ham function constants */
    readonly funcs: typeof HAM_FUNC;
    /** Ham result constants */
    readonly result: typeof HAM_RESULT;
  }
  const ham: Ham;
}