import type { Character } from '../../model/types';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function InventoryList({ character, onChange }: Props) {
  const load = character.inventory.reduce((sum, item) => sum + (item.carried ? item.weight : 0), 0);

  const toggleCarried = (id: string) => {
    onChange({
      inventory: character.inventory.map((i) => (i.id === id ? { ...i, carried: !i.carried } : i)),
    });
  };

  const setNotes = (id: string, notes: string) => {
    onChange({ inventory: character.inventory.map((i) => (i.id === id ? { ...i, notes } : i)) });
  };

  return (
    <section className="sheet-section inventory-list">
      <h2>Inventory</h2>
      <p className="load-meter">Load: {load}</p>
      <ul>
        {character.inventory.map((item) => (
          <li key={item.id} className="inventory-item">
            <Checkbox
              label={item.name}
              checked={item.carried}
              onChange={() => toggleCarried(item.id)}
              size="compact"
            />
            <input
              className="inventory-item-notes"
              type="text"
              placeholder="Notes"
              value={item.notes}
              onChange={(e) => setNotes(item.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
