import { useState } from 'react';
import type { Character, DocumentEntry, JournalEntry, TodoItem } from '../../model/types';
import Tabs from '../ui/Tabs';
import Checkbox from '../ui/Checkbox';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

const PAGES = ['To Do', 'Documents', 'Journal'] as const;
type Page = (typeof PAGES)[number];

function ToDoPage({ character, onChange }: Props) {
  const items = character.notes.todo;

  const updateItem = (id: string, patch: Partial<TodoItem>) => {
    let next = items.map((t) => (t.id === id ? { ...t, ...patch } : t));
    // Completed items sink to the bottom of the list.
    if (patch.done) {
      const item = next.find((t) => t.id === id)!;
      next = [...next.filter((t) => t.id !== id), item];
    }
    onChange({ notes: { ...character.notes, todo: next } });
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}

function JournalPage({ character, onChange }: Props) {
  const entries = character.notes.journal;
  // Journal text is locked (read-only) by default so a stray tap can't
  // edit or erase it, same as Moves; "Edit" unlocks it, "Done" submits and
  // locks it again. A freshly added entry starts unlocked for typing.
  const [editing, setEditing] = useState<Set<string>>(new Set());

  const updateEntry = (id: string, text: string) => {
    onChange({ notes: { ...character.notes, journal: entries.map((e) => (e.id === id ? { ...e, text } : e)) } });
  };

  const addEntry = () => {
    const entry: JournalEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), text: '' };
    onChange({ notes: { ...character.notes, journal: [entry, ...entries] } });
    setEditing((prev) => new Set(prev).add(entry.id));
  };

  const removeEntry = (id: string) => {
    onChange({ notes: { ...character.notes, journal: entries.filter((e) => e.id !== id) } });
  };

  const toggleEditing = (id: string) => {
    setEditing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="journal-list">
      <button type="button" className="npc-add" onClick={addEntry}>
        + Add entry
      </button>
      {entries.map((entry) => {
        const isEditing = editing.has(entry.id);
        return (
          <div key={entry.id} className="journal-entry">
            <div className="journal-entry-header">
              <span className="journal-entry-date">{formatDate(entry.date)}</span>
              <button type="button" className="move-edit-toggle" onClick={() => toggleEditing(entry.id)}>
                {isEditing ? 'Done' : 'Edit'}
              </button>
              <button
                type="button"
                className="npc-remove"
                onClick={() => removeEntry(entry.id)}
                aria-label="Remove journal entry"
              >
                ×
              </button>
            </div>
            <textarea
              className="notes-text journal-entry-text"
              value={entry.text}
              readOnly={!isEditing}
              onChange={(e) => updateEntry(entry.id, e.target.value)}
            />
          </div>
        );
      })}
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
      {page === 'Documents' && <DocumentsPage character={character} onChange={onChange} />}
      {page === 'Journal' && <JournalPage character={character} onChange={onChange} />}
    </section>
  );
}
