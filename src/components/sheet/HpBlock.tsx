import type { Character } from '../../model/types';
import Stepper from '../ui/Stepper';
import InlineField from '../ui/InlineField';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function HpBlock({ character, onChange }: Props) {
  return (
    <section className="sheet-section hp-block">
      <h2>HP, Armor &amp; Damage</h2>
      <div className="hp-row">
        <Stepper
          label={`HP (of ${character.hp.max})`}
          value={character.hp.current}
          min={0}
          max={character.hp.max}
          onChange={(current) => onChange({ hp: { ...character.hp, current } })}
        />
      </div>
      <div className="hp-row-secondary">
        <InlineField
          label="Max HP"
          value={String(character.hp.max)}
          onChange={(v) => onChange({ hp: { ...character.hp, max: Number(v) || 0 } })}
        />
        <InlineField
          label="Armor"
          value={String(character.armor)}
          onChange={(v) => onChange({ armor: Number(v) || 0 })}
        />
        <InlineField
          label="Damage"
          value={character.damageDie}
          onChange={(damageDie) => onChange({ damageDie })}
        />
      </div>
    </section>
  );
}
