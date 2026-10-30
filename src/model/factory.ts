import type { Character, DocumentEntry, TodoItem } from './types';
import { xpNeededForLevel } from './rules';

export function newCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    schemaVersion: 3,
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
    notes: { todo: [], journal: '', documents: [] },
  };
}

// Backfills fields added after a record was saved, and migrates older
// schemaVersions forward:
//   1 -> 2: notes was a single string -> split into todo/journal/documents.
//   2 -> 3: notes.todo was a string -> checklist items; notes.documents was
//           a string -> {name, description} entries.
export function normalizeCharacter(data: Partial<Character> | Record<string, unknown>): Character {
  const base = newCharacter();
  const input = data as Partial<Character>;
  const merged: Character = { ...base, ...input, id: input.id ?? base.id };

  const rawNotes = (data as Record<string, unknown>).notes as Record<string, unknown> | string | undefined;

  if (typeof rawNotes === 'string') {
    // schemaVersion 1: notes was one free-text field.
    merged.notes = { todo: [], journal: rawNotes, documents: [] };
  } else if (rawNotes && typeof rawNotes === 'object') {
    const todo = migrateTodo(rawNotes.todo);
    const documents = migrateDocuments(rawNotes.documents);
    const journal = typeof rawNotes.journal === 'string' ? rawNotes.journal : base.notes.journal;
    merged.notes = { todo, journal, documents };
  }

  merged.followers = (merged.followers ?? []).map((f) => ({ ...f, description: f.description ?? '' }));

  merged.schemaVersion = 3;
  return merged;
}

function migrateTodo(raw: unknown): TodoItem[] {
  if (Array.isArray(raw)) return raw as TodoItem[];
  if (typeof raw === 'string' && raw.trim()) {
    return [{ id: crypto.randomUUID(), text: raw, done: false }];
  }
  return [];
}

function migrateDocuments(raw: unknown): DocumentEntry[] {
  if (Array.isArray(raw)) return raw as DocumentEntry[];
  if (typeof raw === 'string' && raw.trim()) {
    return [{ id: crypto.randomUUID(), name: 'Untitled', description: raw }];
  }
  return [];
}
