import type { Character } from '../../model/types';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function NotesBlock({ character, onChange }: Props) {
  return (
    <footer className="sheet-footer">
      <h2>Notes</h2>
      <textarea
        className="notes-text"
        value={character.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
    </footer>
  );
}
