import type { Character } from '../model/types';
import { normalizeCharacter } from '../model/factory';

export function exportCharacter(character: Character): void {
  const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name || 'character'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importCharacter(file: File): Promise<Character> {
  const text = await file.text();
  const data = JSON.parse(text) as Partial<Character>;
  const version = data.schemaVersion;
  if (version !== 1 && version !== 2 && version !== 3 && version !== 4) {
    throw new Error(`Unsupported schema version: ${version}`);
  }
  return normalizeCharacter(data);
}
