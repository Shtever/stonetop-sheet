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
  description?: string; // flavor text for the group as a whole
  entries: ResourceEntry[];
  stock?: { current: number; max: number }; // e.g. Sacred Pouch stock boxes
}

export interface Npc {
  id: string;
  name: string;
  occupation: string;
  details: string;
}

export interface Follower {
  id: string;
  name: string;
  description: string;
  hp: { current: number; max: number };
  damage: string; // e.g. 'd6'
  tags: string[];
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DocumentEntry {
  id: string;
  name: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  text: string;
}

export interface NotesPages {
  todo: TodoItem[];
  documents: DocumentEntry[];
  journal: JournalEntry[];
}

export interface Item {
  id: string;
  name: string;
  notes: string;
  weight: number; // 0 = small/weightless
  carried: boolean;
  uses?: { total: number; marked: number };
  tags: string[];
  special?: boolean; // shown under Special Possessions instead of Inventory
}

export interface Character {
  id: string;
  schemaVersion: 1 | 2 | 3 | 4;
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
  followers: Follower[];
  notes: NotesPages;
}
