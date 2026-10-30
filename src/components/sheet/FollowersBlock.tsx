import type { Character, Follower } from '../../model/types';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

function emptyFollower(): Follower {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    hp: { current: 0, max: 0 },
    damage: 'd6',
    tags: [],
  };
}

export default function FollowersBlock({ character, onChange }: Props) {
  const updateFollower = (id: string, patch: Partial<Follower>) => {
    onChange({ followers: character.followers.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  };

  const addFollower = () => {
    onChange({ followers: [...character.followers, emptyFollower()] });
  };

  const removeFollower = (id: string) => {
    onChange({ followers: character.followers.filter((f) => f.id !== id) });
  };

  return (
    <section className="sheet-section followers-block">
      <h2>Followers</h2>
      {character.followers.map((follower) => (
        <div key={follower.id} className="follower-card">
          <div className="follower-row">
            <input
              className="follower-name"
              type="text"
              placeholder="Name"
              value={follower.name}
              onChange={(e) => updateFollower(follower.id, { name: e.target.value })}
            />
            <input
              className="follower-description"
              type="text"
              placeholder="Description"
              value={follower.description}
              onChange={(e) => updateFollower(follower.id, { description: e.target.value })}
            />
            <button
              type="button"
              className="npc-remove"
              onClick={() => removeFollower(follower.id)}
              aria-label="Remove follower"
            >
              ×
            </button>
          </div>
          <div className="follower-row follower-row-stats">
            <label className="follower-field">
              <span className="inline-field-label">HP</span>
              <input
                type="number"
                value={follower.hp.current}
                onChange={(e) =>
                  updateFollower(follower.id, { hp: { ...follower.hp, current: Number(e.target.value) || 0 } })
                }
              />
            </label>
            <label className="follower-field">
              <span className="inline-field-label">Max HP</span>
              <input
                type="number"
                value={follower.hp.max}
                onChange={(e) =>
                  updateFollower(follower.id, { hp: { ...follower.hp, max: Number(e.target.value) || 0 } })
                }
              />
            </label>
            <label className="follower-field">
              <span className="inline-field-label">Damage</span>
              <input
                type="text"
                value={follower.damage}
                onChange={(e) => updateFollower(follower.id, { damage: e.target.value })}
              />
            </label>
            <label className="follower-field follower-field-tags">
              <span className="inline-field-label">Tags</span>
              <input
                type="text"
                placeholder="comma, separated"
                value={follower.tags.join(', ')}
                onChange={(e) =>
                  updateFollower(follower.id, {
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
              />
            </label>
          </div>
        </div>
      ))}
      <button type="button" className="npc-add" onClick={addFollower}>
        + Add Follower
      </button>
    </section>
  );
}
