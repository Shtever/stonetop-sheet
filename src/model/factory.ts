import type { Character } from './types';
import { xpNeededForLevel } from './rules';

export function newCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),

    name: '',
    playbook: '',
    level: 1,

    occupation: '',
    background: '',
    origin: '',
    instinct: '',
    appearance: '',

    stats: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    debilities: [],

    hp: { current: 0, max: 0 },
    armor: 0,
    damageDie: 'd6',

    xp: { marked: 0, needed: xpNeededForLevel(1) },

    moves: [],
    resources: [],
    inventory: [],

    bonds: [],
    npcs: [],
    followers: [],
    notes: { todo: '', journal: '', documents: '' },
  };
}

// Backfills fields added after a record was saved, and migrates the old
// schemaVersion 1 shape (notes as a single string) to schemaVersion 2
// (notes split into todo/journal/documents pages).
export function normalizeCharacter(data: Partial<Character> | Record<string, unknown>): Character {
  const base = newCharacter();
  const input = data as Partial<Character>;
  const merged: Character = { ...base, ...input, id: input.id ?? base.id };

  const rawNotes = (data as Record<string, unknown>).notes;
  if (typeof rawNotes === 'string') {
    merged.notes = { todo: '', journal: rawNotes, documents: '' };
  } else if (rawNotes && typeof rawNotes === 'object') {
    merged.notes = { ...base.notes, ...(rawNotes as Partial<Character['notes']>) };
  }

  merged.schemaVersion = 2;
  return merged;
}
