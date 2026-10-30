export type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface Debility {
  name: string;
  affects: StatKey[];
  marked: boolean;
}

export interface Move {
  id: string;
  name: string;
  text: string;
  taken: boolean;
  source: 'starting' | 'advanced' | 'custom';
  boxes?: { total: number; marked: number };
}

export interface ResourceEntry {
  id: string;
  name: string;
  text: string;
  prepared?: boolean;
  used?: boolean;
  boxes?: { total: number; marked: number };
}

export interface ResourceGroup {
  id: string;
  label: string; // 'Invocations', 'Sacred Pouch', ...
  entries: ResourceEntry[];
  stock?: { current: number; max: number }; // e.g. Sacred Pouch stock boxes
}

export interface Npc {
  id: string;
  name: string;
  occupation: string;
  details: string;
}

export interface Item {
  id: string;
  name: string;
  notes: string;
  weight: number; // 0 = small/weightless
  carried: boolean;
  uses?: { total: number; marked: number };
  tags: string[];
}

export interface Character {
  id: string;
  schemaVersion: 1;
  updatedAt: string; // ISO date

  name: string;
  playbook: string; // e.g. 'The Blessed'
  level: number;

  occupation: string;
  background: string;
  origin: string;
  instinct: string;
  appearance: string;

  stats: Record<StatKey, number>; // modifiers, -1..+3
  debilities: Debility[];

  hp: { current: number; max: number };
  armor: number;
  damageDie: string; // 'd6', 'd8', ...

  xp: { marked: number; needed: number };

  moves: Move[];
  resources: ResourceGroup[]; // spells, rites, sacred pouch, companions...
  inventory: Item[];

  bonds: string[];
  npcs: Npc[];
  notes: string;
}
