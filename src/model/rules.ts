// Rules values that come from the Stonetop rulebook. Verify these against
// your own book — see PLAN.md's open questions.
import type { StatKey } from './types';

export const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

// XP needed to level up, by current level. Placeholder until checked against
// the book (PLAN.md open question).
export function xpNeededForLevel(level: number): number {
  return 7 + level;
}
