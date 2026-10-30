import type { Character, ResourceEntry, ResourceGroup } from '../../model/types';
import Checkbox from '../ui/Checkbox';
import BoxTrack from '../ui/BoxTrack';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function ResourceGroups({ character, onChange }: Props) {
  const updateGroup = (groupId: string, patch: Partial<ResourceGroup>) => {
    onChange({ resources: character.resources.map((g) => (g.id === groupId ? { ...g, ...patch } : g)) });
  };

  const updateEntry = (groupId: string, entryId: string, patch: Partial<ResourceEntry>) => {
    onChange({
      resources: character.resources.map((g) =>
        g.id !== groupId
          ? g
          : { ...g, entries: g.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)) },
      ),
    });
  };

  const setStock = (groupId: string, current: number) => {
    onChange({
      resources: character.resources.map((g) =>
        g.id !== groupId || !g.stock ? g : { ...g, stock: { ...g.stock, current } },
      ),
    });
  };

  return (
    <div className="resource-groups">
      {character.resources.map((group) => (
        <div key={group.id} className="resource-group">
          <div className="resource-group-header">
            <h3>{group.label}</h3>
            {group.stock && (
              <div className="resource-group-stock">
                <span className="resource-group-stock-label">
                  Stock {group.stock.current} / {group.stock.max}
                </span>
                <BoxTrack
                  total={group.stock.max}
                  marked={group.stock.current}
                  size="compact"
                  onChange={(current) => setStock(group.id, current)}
                />
              </div>
            )}
          </div>
          {group.description !== undefined && (
            <textarea
              className="resource-group-description"
              placeholder="Description"
              value={group.description}
              onChange={(e) => updateGroup(group.id, { description: e.target.value })}
            />
          )}
          {group.entries.map((entry) => (
            <div key={entry.id} className="resource-entry">
              <div className="resource-entry-row">
                <span className="resource-entry-name">{entry.name}</span>
                {entry.prepared !== undefined && (
                  <Checkbox
                    label="Prepared"
                    checked={entry.prepared}
                    onChange={(prepared) => updateEntry(group.id, entry.id, { prepared })}
                    size="compact"
                  />
                )}
                {entry.used !== undefined && (
                  <Checkbox
                    label="Used"
                    checked={entry.used}
                    onChange={(used) => updateEntry(group.id, entry.id, { used })}
                    size="compact"
                  />
                )}
              </div>
              <input
                className="resource-entry-text"
                type="text"
                placeholder="Description"
                value={entry.text}
                onChange={(e) => updateEntry(group.id, entry.id, { text: e.target.value })}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
