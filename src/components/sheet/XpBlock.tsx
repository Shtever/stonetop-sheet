import type { Character } from '../../model/types';
import BoxTrack from '../ui/BoxTrack';
import InlineField from '../ui/InlineField';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function XpBlock({ character, onChange }: Props) {
  const leveledUp = character.xp.marked >= character.xp.needed;

  return (
    <section className="sheet-section xp-block">
      <h2>XP &amp; Background</h2>
      <div className="xp-row">
        <BoxTrack
          total={character.xp.needed}
          marked={character.xp.marked}
          onChange={(marked) => onChange({ xp: { ...character.xp, marked } })}
        />
        {leveledUp && <span className="xp-level-up">Level up!</span>}
      </div>
      <InlineField
        label="Bonds"
        value={character.bonds.join(' / ')}
        onChange={(v) => onChange({ bonds: v.split('/').map((s) => s.trim()).filter(Boolean) })}
      />
    </section>
  );
}
