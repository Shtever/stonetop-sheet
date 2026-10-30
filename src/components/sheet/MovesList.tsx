import { useState } from 'react';
import type { Character, Move } from '../../model/types';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function MovesList({ character, onChange }: Props) {
  // Move text is locked (read-only) by default so a stray tap can't edit or
  // erase it; "Edit" unlocks it, "Done" submits and locks it again.
  const [editing, setEditing] = useState<Set<string>>(new Set());

  const updateMove = (id: string, patch: Partial<Move>) => {
    onChange({ moves: character.moves.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  };

  const toggleEditing = (id: string) => {
    setEditing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="sheet-section moves-list">
      <h2>Moves</h2>
      {character.moves.map((move) => {
        const isEditing = editing.has(move.id);
        return (
          <div key={move.id} className="move-entry">
            <div className="move-entry-header">
              <Checkbox
                label={move.name}
                checked={move.taken}
                onChange={(taken) => updateMove(move.id, { taken })}
                size="compact"
              />
              <button type="button" className="move-edit-toggle" onClick={() => toggleEditing(move.id)}>
                {isEditing ? 'Done' : 'Edit'}
              </button>
            </div>
            <textarea
              className="move-text"
              placeholder="Move text (from your own book)"
              value={move.text}
              readOnly={!isEditing}
              onChange={(e) => updateMove(move.id, { text: e.target.value })}
            />
          </div>
        );
      })}
    </section>
  );
}
