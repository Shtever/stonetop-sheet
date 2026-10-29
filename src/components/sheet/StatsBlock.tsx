import type { Character, StatKey } from '../../model/types';
import { STAT_KEYS } from '../../model/rules';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function StatsBlock({ character, onChange }: Props) {
  const debilityFor = (stat: StatKey) => character.debilities.find((d) => d.affects.includes(stat));

  const toggleDebility = (stat: StatKey) => {
    const existing = debilityFor(stat);
    if (!existing) return;
    onChange({
      debilities: character.debilities.map((d) =>
        d === existing ? { ...d, marked: !d.marked } : d,
      ),
    });
  };

  const setStat = (stat: StatKey, value: number) => {
    onChange({ stats: { ...character.stats, [stat]: value } });
  };

  return (
    <section className="sheet-section stats-block">
      <h2>Stats &amp; Debilities</h2>
      <div className="stats-grid">
        {STAT_KEYS.map((stat) => {
          const debility = debilityFor(stat);
          return (
            <div key={stat} className="stat-box">
              <span className="stat-key">{stat}</span>
              <input
                className="stat-modifier"
                type="number"
                value={character.stats[stat]}
                onChange={(e) => setStat(stat, Number(e.target.value) || 0)}
              />
              {debility && (
                <Checkbox label={debility.name} checked={debility.marked} onChange={() => toggleDebility(stat)} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
