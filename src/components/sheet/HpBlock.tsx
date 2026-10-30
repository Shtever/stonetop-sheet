import type { Character } from '../../model/types';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function HpBlock({ character, onChange }: Props) {
  const setHp = (current: number) => {
    const clamped = Math.max(0, Math.min(character.hp.max, current));
    onChange({ hp: { ...character.hp, current: clamped } });
  };

  return (
    <section className="sheet-section hp-block">
      <h2>HP, Armor &amp; Damage</h2>
      <div className="hp-strip">
        <div className="hp-current">
          <button type="button" onClick={() => setHp(character.hp.current - 1)} aria-label="Decrease HP">
            −
          </button>
          <input
            className="hp-current-value"
            type="number"
            value={character.hp.current}
            onChange={(e) => setHp(Number(e.target.value) || 0)}
          />
          <button type="button" onClick={() => setHp(character.hp.current + 1)} aria-label="Increase HP">
            +
          </button>
          <span className="hp-max">
            / &nbsp;
            <input
              className="hp-max-value"
              type="number"
              value={character.hp.max}
              onChange={(e) => onChange({ hp: { ...character.hp, max: Number(e.target.value) || 0 } })}
            />
          </span>
          <span className="stat-key">HP</span>
        </div>
        <div className="stat-box">
          <span className="stat-key">Armor</span>
          <input
            className="stat-modifier"
            type="number"
            value={character.armor}
            onChange={(e) => onChange({ armor: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="stat-box">
          <span className="stat-key">Damage</span>
          <input
            className="stat-modifier stat-modifier-text"
            type="text"
            value={character.damageDie}
            onChange={(e) => onChange({ damageDie: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}
