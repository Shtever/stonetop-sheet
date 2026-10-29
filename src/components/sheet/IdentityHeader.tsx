import type { Character } from '../../model/types';
import InlineField from '../ui/InlineField';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function IdentityHeader({ character, onChange }: Props) {
  return (
    <header className="sheet-header">
      <div className="sheet-header-top">
        <InlineField label="Name" value={character.name} onChange={(name) => onChange({ name })} />
        <InlineField
          label="Playbook"
          value={character.playbook}
          onChange={(playbook) => onChange({ playbook })}
        />
        <InlineField
          label="Level"
          value={String(character.level)}
          onChange={(v) => onChange({ level: Number(v) || 1 })}
        />
      </div>
      <div className="sheet-header-grid">
        <InlineField
          label="Occupation"
          value={character.occupation}
          onChange={(occupation) => onChange({ occupation })}
        />
        <InlineField
          label="Background"
          value={character.background}
          onChange={(background) => onChange({ background })}
        />
        <InlineField label="Origin" value={character.origin} onChange={(origin) => onChange({ origin })} />
        <InlineField
          label="Instinct"
          value={character.instinct}
          onChange={(instinct) => onChange({ instinct })}
        />
      </div>
      <InlineField
        label="Appearance"
        value={character.appearance}
        onChange={(appearance) => onChange({ appearance })}
      />
    </header>
  );
}
