import Dexie, { type Table } from 'dexie';
import type { Character } from '../model/types';

class StonetopDB extends Dexie {
  characters!: Table<Character, string>;

  constructor() {
    super('stonetop-sheet');
    this.version(1).stores({
      characters: 'id, updatedAt',
    });
  }
}

export const db = new StonetopDB();

export async function saveCharacter(character: Character): Promise<void> {
  await db.characters.put({ ...character, updatedAt: new Date().toISOString() });
}

export async function loadLastCharacter(): Promise<Character | undefined> {
  return db.characters.orderBy('updatedAt').last();
}
