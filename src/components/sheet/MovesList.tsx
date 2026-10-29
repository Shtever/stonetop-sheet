import type { Character, Move } from '../../model/types';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function MovesList({ character, onChange }: Props) {
  const updateMove = (id: string, patch: Partial<Move>) => {
    onChange({ moves: character.moves.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  };

  return (
    <section className="sheet-section moves-list">
      <h2>Moves</h2>
      {character.moves.map((move) => (
        <div key={move.id} className="move-entry">
          <Checkbox
            label={move.name}
            checked={move.taken}
            onChange={(taken) => updateMove(move.id, { taken })}
          />
          <textarea
            className="move-text"
            placeholder="Move text (from your own book)"
            value={move.text}
            onChange={(e) => updateMove(move.id, { text: e.target.value })}
          />
        </div>
      ))}
    </section>
  );
}
