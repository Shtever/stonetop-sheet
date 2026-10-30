import { useState } from 'react';
import type { Character, NotesPages } from '../../model/types';
import Tabs from '../ui/Tabs';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

const PAGES = ['To Do', 'Journal', 'Documents'] as const;
type Page = (typeof PAGES)[number];

const FIELD_BY_PAGE: Record<Page, keyof NotesPages> = {
  'To Do': 'todo',
  Journal: 'journal',
  Documents: 'documents',
};

export default function NotesBlock({ character, onChange }: Props) {
  const [page, setPage] = useState<Page>('To Do');
  const field = FIELD_BY_PAGE[page];

  return (
    <section className="sheet-section notes-block">
      <h2>Notes</h2>
      <Tabs tabs={PAGES} active={page} onChange={(p) => setPage(p as Page)} className="sub-tabs" />
      <textarea
        className="notes-text"
        value={character.notes[field]}
        onChange={(e) => onChange({ notes: { ...character.notes, [field]: e.target.value } })}
      />
    </section>
  );
}
