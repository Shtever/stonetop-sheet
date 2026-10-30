import { useEffect, useState } from 'react';
import './App.css';
import { useCharacterStore } from './store/useCharacter';
import { exportCharacter, importCharacter } from './io/backup';
import Tabs from './components/ui/Tabs';
import IdentityHeader from './components/sheet/IdentityHeader';
import StatsBlock from './components/sheet/StatsBlock';
import HpBlock from './components/sheet/HpBlock';
import MovesList from './components/sheet/MovesList';
import ResourceGroups from './components/sheet/ResourceGroups';
import InventoryList from './components/sheet/InventoryList';
import NpcsBlock from './components/sheet/NpcsBlock';
import FollowersBlock from './components/sheet/FollowersBlock';
import NotesBlock from './components/sheet/NotesBlock';

const TABS = ['Character', 'Moves', 'Inventory', 'Followers', 'NPCs', 'Notes'] as const;
type Tab = (typeof TABS)[number];

export default function App() {
  const { character, loaded, init, update } = useCharacterStore();
  const [tab, setTab] = useState<Tab>('Character');

  useEffect(() => {
    void init();
  }, [init]);

  if (!loaded) {
    return <div className="sheet-loading">Loading...</div>;
  }

  return (
    <div className="sheet">
      <IdentityHeader character={character} onChange={update} />

      <Tabs tabs={TABS} active={tab} onChange={(t) => setTab(t as Tab)} />

      <main className="sheet-tab-content">
        {tab === 'Character' && (
          <>
            <StatsBlock character={character} onChange={update} />
            <HpBlock character={character} onChange={update} />
          </>
        )}

        {tab === 'Moves' && <MovesList character={character} onChange={update} />}

        {tab === 'Inventory' && (
          <>
            <InventoryList character={character} onChange={update} />
            <ResourceGroups character={character} onChange={update} />
          </>
        )}

        {tab === 'Followers' && <FollowersBlock character={character} onChange={update} />}

        {tab === 'NPCs' && <NpcsBlock character={character} onChange={update} />}

        {tab === 'Notes' && <NotesBlock character={character} onChange={update} />}
      </main>

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
    </div>
  );
}
