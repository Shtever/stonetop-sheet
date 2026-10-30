import { useState } from 'react';
import type { Character } from '../../model/types';
import Tabs from '../ui/Tabs';
import InventoryList from './InventoryList';
import ResourceGroups from './ResourceGroups';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

const PAGES = ['Inventory', 'Special Possessions', 'Resources'] as const;
type Page = (typeof PAGES)[number];

export default function InventoryTabs({ character, onChange }: Props) {
  const [page, setPage] = useState<Page>('Inventory');

  return (
    <section className="sheet-section inventory-tabs">
      <h2>Inventory</h2>
      <Tabs tabs={PAGES} active={page} onChange={(p) => setPage(p as Page)} className="sub-tabs" />

      {page === 'Inventory' && <InventoryList character={character} onChange={onChange} special={false} />}
      {page === 'Special Possessions' && <InventoryList character={character} onChange={onChange} special={true} />}
      {page === 'Resources' && <ResourceGroups character={character} onChange={onChange} />}
    </section>
  );
}
