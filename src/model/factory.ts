import type { Character } from './types';
import { xpNeededForLevel } from './rules';

export function newCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    schemaVersion: 1,
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
    notes: '',
  };
}
