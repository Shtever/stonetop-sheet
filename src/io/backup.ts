import type { Character } from '../model/types';

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
  const data = JSON.parse(text) as Character;
  if (data.schemaVersion !== 1) {
    throw new Error(`Unsupported schema version: ${data.schemaVersion}`);
  }
  return data;
}
