import { useEffect } from 'react';
import './App.css';
import { useCharacterStore } from './store/useCharacter';
import { exportCharacter, importCharacter } from './io/backup';
import IdentityHeader from './components/sheet/IdentityHeader';
import StatsBlock from './components/sheet/StatsBlock';
import HpBlock from './components/sheet/HpBlock';
import XpBlock from './components/sheet/XpBlock';
import MovesList from './components/sheet/MovesList';
import ResourceGroups from './components/sheet/ResourceGroups';
import InventoryList from './components/sheet/InventoryList';
import NotesBlock from './components/sheet/NotesBlock';

export default function App() {
  const { character, loaded, init, update } = useCharacterStore();

  useEffect(() => {
    void init();
  }, [init]);

  if (!loaded) {
    return <div className="sheet-loading">Loading...</div>;
  }

  return (
    <div className="sheet">
      <IdentityHeader character={character} onChange={update} />

      <div className="sheet-actions">
        <button type="button" onClick={() => exportCharacter(character)}>
          Export JSON
        </button>
        <label className="import-button">
          Import JSON
          <input
            type="file"
            accept="application/json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const imported = await importCharacter(file);
              update(imported);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      <main className="sheet-columns">
        <div className="sheet-column">
          <StatsBlock character={character} onChange={update} />
          <HpBlock character={character} onChange={update} />
          <XpBlock character={character} onChange={update} />
        </div>

        <div className="sheet-column">
          <MovesList character={character} onChange={update} />
          <ResourceGroups character={character} onChange={update} />
          <InventoryList character={character} onChange={update} />
        </div>
      </main>

      <NotesBlock character={character} onChange={update} />
    </div>
  );
}
