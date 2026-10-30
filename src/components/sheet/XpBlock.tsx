import type { Character } from '../../model/types';
import BoxTrack from '../ui/BoxTrack';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function XpBlock({ character, onChange }: Props) {
  const leveledUp = character.xp.marked >= character.xp.needed;

  return (
    <div className="xp-block">
      <span className="inline-field-label">XP</span>
      <div className="xp-row">
        <BoxTrack
          total={character.xp.needed}
          marked={character.xp.marked}
          size="compact"
          onChange={(marked) => onChange({ xp: { ...character.xp, marked } })}
        />
        {leveledUp && <span className="xp-level-up">Level up!</span>}
      </div>
    </div>
  );
}
