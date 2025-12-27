export interface CVarInfo extends nodemod.Cvar {
  description?: string;
}

export interface CVarWrapper {
  name: string;
  value: string;
  float: number;
  int: number;
  bool: boolean;
  reset(): void;
  setDirect(value: string | number): void;
}

export type CVarChangeCallback = (currentValue: string, lastValue: string, name: string) => void;

// Console variable management utilities
export default class NodemodCVar {
  private registeredCVars = new Map<string, CVarInfo>();
  
  // Register a new console variable
  register(name: string, defaultValue: string = '', flags: number = 0, description: string = ''): void {
    const cvar: CVarInfo = {
      name,
      string: defaultValue,
      flags,
      value: parseFloat(defaultValue) || 0,
      description,
      next: null
    };

    nodemod.eng.cVarRegister(cvar);
    this.registeredCVars.set(name, cvar);
  }
  
  // Get console variable value as string
  getString(name: string): string {
    return nodemod.eng.cVarGetString(name);
  }
  
  // Get console variable value as float
  getFloat(name: string): number {
    return nodemod.eng.cVarGetFloat(name);
  }
  
  // Get console variable value as integer
  getInt(name: string): number {
    return Math.floor(this.getFloat(name));
  }
  
  // Get console variable value as boolean
  getBool(name: string): boolean {
    const value = this.getFloat(name);
    return value !== 0;
  }
  
  // Set console variable value as string
  setString(name: string, value: string | number): void {
    nodemod.eng.cVarSetString(name, String(value));
  }
  
  // Set console variable value as float
  setFloat(name: string, value: string | number): void {
    nodemod.eng.cVarSetFloat(name, typeof value === 'number' ? value : parseFloat(value));
  }
  
  // Set console variable value as integer
  setInt(name: string, value: string | number): void {
    const intValue = typeof value === 'number' ? value : parseInt(value.toString());
    this.setFloat(name, intValue);
  }
  
  // Set console variable value as boolean
  setBool(name: string, value: boolean): void {
    this.setFloat(name, value ? 1 : 0);
  }
  
  // Directly set console variable (bypasses some checks)
  setDirect(name: string, value: string | number): void {
    const cvar = nodemod.eng.cVarGetPointer(name);
    nodemod.eng.cvarDirectSet(cvar, String(value));
  }
  
  // Get console variable pointer
  getPointer(name: string): nodemod.Cvar {
    return nodemod.eng.cVarGetPointer(name);
  }
  
  // Check if console variable exists
  exists(name: string): boolean {
    try {
      // Use getPointer which returns null/undefined for non-existent cvars
      // getString returns "" for non-existent cvars which is indistinguishable from empty value
      const ptr = nodemod.eng.cVarGetPointer(name);
      const exists = ptr !== null && ptr !== undefined;
      return exists;
    } catch {
      return false;
    }
  }
  
  // Get all registered console variables
  getRegistered(): Map<string, CVarInfo> {
    return new Map(this.registeredCVars);
  }
  
  // Create console variable wrapper with utility methods
  // Always returns a wrapper - getters do live lookups so cvar doesn't need to exist at wrap time
  wrap(name: string): CVarWrapper {
    const self = this;
    return {
      name,
      
      get value(): string {
        return nodemod.eng.cVarGetString(name);
      },
      
      set value(val: string) {
        nodemod.eng.cVarSetString(name, String(val));
      },
      
      get float(): number {
        return nodemod.eng.cVarGetFloat(name);
      },
      
      set float(val: number) {
        nodemod.eng.cVarSetFloat(name, val);
      },
      
      get int(): number {
        return Math.floor(nodemod.eng.cVarGetFloat(name));
      },
      
      set int(val: number) {
        nodemod.eng.cVarSetFloat(name, val);
      },
      
      get bool(): boolean {
        return nodemod.eng.cVarGetFloat(name) !== 0;
      },
      
      set bool(val: boolean) {
        nodemod.eng.cVarSetFloat(name, val ? 1 : 0);
      },
      
      reset(): void {
        const registered = self.registeredCVars.get(name);
        if (registered) {
          nodemod.eng.cVarSetString(name, registered.string);
        }
      },
      
      setDirect(value: string | number): void {
        const cvar = nodemod.eng.cVarGetPointer(name);
        nodemod.eng.cvarDirectSet(cvar, String(value));
      }
    };
  }
  
  // Batch operations
  setMultiple(cvars: { [key: string]: string | number }): void {
    for (const [name, value] of Object.entries(cvars)) {
      this.setString(name, value);
    }
  }
  
  getMultiple(names: string[]): { [key: string]: string } {
    const results: { [key: string]: string } = {};
    for (const name of names) {
      results[name] = this.getString(name);
    }
    return results;
  }
  
  // Predefined common CVars with utility methods
  get mp_friendlyfire(): CVarWrapper { return this.wrap('mp_friendlyfire'); }
  get mp_timelimit(): CVarWrapper { return this.wrap('mp_timelimit'); }
  get mp_fraglimit(): CVarWrapper { return this.wrap('mp_fraglimit'); }
  get hostname(): CVarWrapper { return this.wrap('hostname'); }
  get maxplayers(): CVarWrapper { return this.wrap('maxplayers'); }
  get sv_gravity(): CVarWrapper { return this.wrap('sv_gravity'); }
  get sv_cheats(): CVarWrapper { return this.wrap('sv_cheats'); }
  get pausable(): CVarWrapper { return this.wrap('pausable'); }
  get sv_lan(): CVarWrapper { return this.wrap('sv_lan'); }
  get sv_region(): CVarWrapper { return this.wrap('sv_region'); }
  
  // Create common server CVars
  initializeServerCVars(): void {
    const commonCVars = [
      { name: 'nodemod_version', value: '1.0.0', flags: nodemod.FCVAR.SERVER, description: 'NodeMod version' },
      { name: 'nodemod_debug', value: '0', flags: nodemod.FCVAR.SERVER, description: 'NodeMod debug mode' },
      { name: 'nodemod_enabled', value: '1', flags: nodemod.FCVAR.SERVER, description: 'NodeMod enabled' }
    ];
    
    commonCVars.forEach(cvar => {
      this.register(cvar.name, cvar.value, cvar.flags, cvar.description);
    });
  }
  
  // Console variable change monitoring
  watchVariable(name: string, callback: CVarChangeCallback, interval: number = 1000): () => void {
    let lastValue = this.getString(name);
    
    const watchInterval = setInterval(() => {
      const currentValue = this.getString(name);
      if (currentValue !== lastValue) {
        callback(currentValue, lastValue, name);
        lastValue = currentValue;
      }
    }, interval);
    
    return () => clearInterval(watchInterval);
  }
}