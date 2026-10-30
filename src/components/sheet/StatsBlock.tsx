import type { Character } from '../../model/types';
import { STAT_KEYS, DEBILITY_DEFS } from '../../model/rules';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function StatsBlock({ character, onChange }: Props) {
  const setStat = (stat: (typeof STAT_KEYS)[number], value: number) => {
    onChange({ stats: { ...character.stats, [stat]: value } });
  };

  const isMarked = (name: string) => character.debilities.find((d) => d.name === name)?.marked ?? false;

  const toggleDebility = (name: string, affects: typeof STAT_KEYS) => {
    const existing = character.debilities.find((d) => d.name === name);
    const debilities = existing
      ? character.debilities.map((d) => (d.name === name ? { ...d, marked: !d.marked } : d))
      : [...character.debilities, { name, affects, marked: true }];
    onChange({ debilities });
  };

  return (
    <section className="sheet-section stats-block">
      <h2>Stats &amp; Debilities</h2>
      <div className="stats-grid">
        {STAT_KEYS.map((stat) => (
          <div key={stat} className="stat-box">
            <span className="stat-key">{stat}</span>
            <input
              className="stat-modifier"
              type="number"
              value={character.stats[stat]}
              onChange={(e) => setStat(stat, Number(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      <div className="debilities-row">
        {DEBILITY_DEFS.map((d) => (
          <Checkbox
            key={d.name}
            label={`${d.name} (${d.affects.join('/')})`}
            checked={isMarked(d.name)}
            onChange={() => toggleDebility(d.name, d.affects)}
          />
        ))}
      </div>
    </section>
  );
}
