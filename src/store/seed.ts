import type { Character } from '../model/types';
import { normalizeCharacter } from '../model/factory';

// Looks for a local-only seed character at public/templates/*.json (gitignored,
// per CLAUDE.md: don't commit Stonetop character/rulebook content). Returns
// undefined if none is present, so a fresh clone just gets a blank sheet.
export async function loadSeedCharacter(): Promise<Character | undefined> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}templates/seed-character.json`);
    if (!res.ok) return undefined;
    const data = (await res.json()) as Partial<Character>;
    return { ...normalizeCharacter(data), id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
  } catch {
    return undefined;
  }
}
