import { create } from 'zustand';
import type { Character } from '../model/types';
import { newCharacter } from '../model/factory';
import { saveCharacter, loadLastCharacter } from './db';
import { loadSeedCharacter } from './seed';

interface CharacterStore {
  character: Character;
  loaded: boolean;
  init: () => Promise<void>;
  update: (patch: Partial<Character>) => void;
}

function persist(character: Character) {
  // Fire-and-forget autosave; Dexie serializes writes per table internally.
  void saveCharacter(character);
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  character: newCharacter(),
  loaded: false,

  init: async () => {
    const saved = await loadLastCharacter();
    if (saved) {
      set({ character: saved, loaded: true });
      return;
    }
    const seeded = await loadSeedCharacter();
    const character = seeded ?? newCharacter();
    set({ character, loaded: true });
    persist(character);
  },

  update: (patch) => {
    const next = { ...get().character, ...patch, updatedAt: new Date().toISOString() };
    set({ character: next });
    persist(next);
  },
}));
