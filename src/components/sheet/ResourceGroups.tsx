import type { Character, ResourceEntry } from '../../model/types';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

export default function ResourceGroups({ character, onChange }: Props) {
  const updateEntry = (groupId: string, entryId: string, patch: Partial<ResourceEntry>) => {
    onChange({
      resources: character.resources.map((g) =>
        g.id !== groupId
          ? g
          : { ...g, entries: g.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)) },
      ),
    });
  };

  return (
    <section className="sheet-section resource-groups">
      <h2>Spells &amp; Resources</h2>
      {character.resources.map((group) => (
        <div key={group.id} className="resource-group">
          <h3>{group.label}</h3>
          {group.entries.map((entry) => (
            <div key={entry.id} className="resource-entry">
              <span className="resource-entry-name">{entry.name}</span>
              {entry.prepared !== undefined && (
                <Checkbox
                  label="Prepared"
                  checked={entry.prepared}
                  onChange={(prepared) => updateEntry(group.id, entry.id, { prepared })}
                />
              )}
              {entry.used !== undefined && (
                <Checkbox
                  label="Used"
                  checked={entry.used}
                  onChange={(used) => updateEntry(group.id, entry.id, { used })}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
