import type { Character, Npc } from '../../model/types';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

function emptyNpc(): Npc {
  return { id: crypto.randomUUID(), name: '', occupation: '', details: '' };
}

export default function NpcsBlock({ character, onChange }: Props) {
  const updateNpc = (id: string, patch: Partial<Npc>) => {
    onChange({ npcs: character.npcs.map((n) => (n.id === id ? { ...n, ...patch } : n)) });
  };

  const addNpc = () => {
    onChange({ npcs: [...character.npcs, emptyNpc()] });
  };

  const removeNpc = (id: string) => {
    onChange({ npcs: character.npcs.filter((n) => n.id !== id) });
  };

  return (
    <section className="sheet-section npcs-block">
      <h2>NPCs</h2>
      <table className="npcs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Occupation</th>
            <th>Details</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {character.npcs.map((npc) => (
            <tr key={npc.id}>
              <td>
                <input value={npc.name} onChange={(e) => updateNpc(npc.id, { name: e.target.value })} />
              </td>
              <td>
                <input
                  value={npc.occupation}
                  onChange={(e) => updateNpc(npc.id, { occupation: e.target.value })}
                />
              </td>
              <td>
                <input value={npc.details} onChange={(e) => updateNpc(npc.id, { details: e.target.value })} />
              </td>
              <td>
                <button type="button" className="npc-remove" onClick={() => removeNpc(npc.id)} aria-label="Remove NPC">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="npc-add" onClick={addNpc}>
        + Add NPC
      </button>
    </section>
  );
}
