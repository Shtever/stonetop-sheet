import type { Character, DocumentEntry, JournalEntry, TodoItem } from './types';
import { xpNeededForLevel } from './rules';

export function newCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    schemaVersion: 4,
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
    notes: { todo: [], documents: [], journal: [] },
  };
}

// Backfills fields added after a record was saved, and migrates older
// schemaVersions forward:
//   1 -> 2: notes was a single string -> split into todo/journal/documents.
//   2 -> 3: notes.todo was a string -> checklist items; notes.documents was
//           a string -> {name, description} entries.
//   3 -> 4: notes.journal was a string -> dated journal entries.
export function normalizeCharacter(data: Partial<Character> | Record<string, unknown>): Character {
  const base = newCharacter();
  const input = data as Partial<Character>;
  const merged: Character = { ...base, ...input, id: input.id ?? base.id };

  const rawNotes = (data as Record<string, unknown>).notes as Record<string, unknown> | string | undefined;

  if (typeof rawNotes === 'string') {
    // schemaVersion 1: notes was one free-text field.
    merged.notes = { todo: [], documents: [], journal: migrateJournal(rawNotes) };
  } else if (rawNotes && typeof rawNotes === 'object') {
    merged.notes = {
      todo: migrateTodo(rawNotes.todo),
      documents: migrateDocuments(rawNotes.documents),
      journal: migrateJournal(rawNotes.journal),
    };
  }

  merged.followers = (merged.followers ?? []).map((f) => ({ ...f, description: f.description ?? '' }));
  merged.resources = (merged.resources ?? []).map((g) => ({ description: '', ...g }));

  merged.schemaVersion = 4;
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

function migrateJournal(raw: unknown): JournalEntry[] {
  if (Array.isArray(raw)) return raw as JournalEntry[];
  if (typeof raw === 'string' && raw.trim()) {
    return [{ id: crypto.randomUUID(), date: new Date().toISOString(), text: raw }];
  }
  return [];
}
