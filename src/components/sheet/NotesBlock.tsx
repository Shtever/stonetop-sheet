import { useState } from 'react';
import type { Character, DocumentEntry, TodoItem } from '../../model/types';
import Tabs from '../ui/Tabs';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

const PAGES = ['To Do', 'Journal', 'Documents'] as const;
type Page = (typeof PAGES)[number];

function ToDoPage({ character, onChange }: Props) {
  const items = character.notes.todo;

  const updateItem = (id: string, patch: Partial<TodoItem>) => {
    onChange({ notes: { ...character.notes, todo: items.map((t) => (t.id === id ? { ...t, ...patch } : t)) } });
  };

  const addItem = () => {
    onChange({
      notes: { ...character.notes, todo: [...items, { id: crypto.randomUUID(), text: '', done: false }] },
    });
  };

  const removeItem = (id: string) => {
    onChange({ notes: { ...character.notes, todo: items.filter((t) => t.id !== id) } });
  };

  return (
    <div className="todo-checklist">
      {items.map((item) => (
        <div key={item.id} className="todo-item">
          <Checkbox checked={item.done} onChange={(done) => updateItem(item.id, { done })} size="compact" />
          <input
            className={item.done ? 'todo-item-text done' : 'todo-item-text'}
            type="text"
            placeholder="To do..."
            value={item.text}
            onChange={(e) => updateItem(item.id, { text: e.target.value })}
          />
          <button type="button" className="npc-remove" onClick={() => removeItem(item.id)} aria-label="Remove item">
            ×
          </button>
        </div>
      ))}
      <button type="button" className="npc-add" onClick={addItem}>
        + Add item
      </button>
    </div>
  );
}

function DocumentsPage({ character, onChange }: Props) {
  const docs = character.notes.documents;

  const updateDoc = (id: string, patch: Partial<DocumentEntry>) => {
    onChange({ notes: { ...character.notes, documents: docs.map((d) => (d.id === id ? { ...d, ...patch } : d)) } });
  };

  const addDoc = () => {
    onChange({
      notes: { ...character.notes, documents: [...docs, { id: crypto.randomUUID(), name: '', description: '' }] },
    });
  };

  const removeDoc = (id: string) => {
    onChange({ notes: { ...character.notes, documents: docs.filter((d) => d.id !== id) } });
  };

  return (
    <div>
      <table className="npcs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              <td>
                <input value={doc.name} onChange={(e) => updateDoc(doc.id, { name: e.target.value })} />
              </td>
              <td>
                <input
                  value={doc.description}
                  onChange={(e) => updateDoc(doc.id, { description: e.target.value })}
                />
              </td>
              <td>
                <button type="button" className="npc-remove" onClick={() => removeDoc(doc.id)} aria-label="Remove document">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="npc-add" onClick={addDoc}>
        + Add document
      </button>
    </div>
  );
}

export default function NotesBlock({ character, onChange }: Props) {
  const [page, setPage] = useState<Page>('To Do');

  return (
    <section className="sheet-section notes-block">
      <h2>Notes</h2>
      <Tabs tabs={PAGES} active={page} onChange={(p) => setPage(p as Page)} className="sub-tabs" />

      {page === 'To Do' && <ToDoPage character={character} onChange={onChange} />}

      {page === 'Journal' && (
        <textarea
          className="notes-text"
          value={character.notes.journal}
          onChange={(e) => onChange({ notes: { ...character.notes, journal: e.target.value } })}
        />
      )}

      {page === 'Documents' && <DocumentsPage character={character} onChange={onChange} />}
    </section>
  );
}
