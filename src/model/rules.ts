// Rules values that come from the Stonetop rulebook. Verify these against
// your own book — see PLAN.md's open questions.
import type { StatKey } from './types';

export const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

// XP needed to level up, by current level. Placeholder until checked against
// the book (PLAN.md open question).
export function xpNeededForLevel(level: number): number {
  return 7 + level;
}

// The three Stonetop debilities, each tied to a pair of stats.
export const DEBILITY_DEFS: { name: string; affects: StatKey[] }[] = [
  { name: 'Weakened', affects: ['STR', 'DEX'] },
  { name: 'Dazed', affects: ['INT', 'WIS'] },
  { name: 'Miserable', affects: ['CON', 'CHA'] },
];
