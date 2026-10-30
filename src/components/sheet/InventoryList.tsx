import type { Character, Item } from '../../model/types';
import TagsInput from '../ui/TagsInput';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

function emptyItem(): Item {
  return { id: crypto.randomUUID(), name: '', notes: '', weight: 0, carried: true, tags: [] };
}

export default function InventoryList({ character, onChange }: Props) {
  const updateItem = (id: string, patch: Partial<Item>) => {
    onChange({ inventory: character.inventory.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  };

  const addItem = () => {
    onChange({ inventory: [...character.inventory, emptyItem()] });
  };

  const removeItem = (id: string) => {
    onChange({ inventory: character.inventory.filter((i) => i.id !== id) });
  };

  return (
    <section className="sheet-section inventory-list">
      <h2>Inventory</h2>
      <table className="npcs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Tags</th>
            <th>Description</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {character.inventory.map((item) => (
            <tr key={item.id}>
              <td>
                <input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
              </td>
              <td>
                <TagsInput value={item.tags} onChange={(tags) => updateItem(item.id, { tags })} />
              </td>
              <td>
                <input value={item.notes} onChange={(e) => updateItem(item.id, { notes: e.target.value })} />
              </td>
              <td>
                <button type="button" className="npc-remove" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="npc-add" onClick={addItem}>
        + Add item
      </button>
    </section>
  );
}
