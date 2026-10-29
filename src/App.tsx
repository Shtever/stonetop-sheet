import './App.css';

// Phase 1: empty scaffold. Each <section> below is placeholder for the
// real sheet components built in later phases (see PLAN.md).
export default function App() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Stonetop Character Sheet</h1>
        <div className="sheet-header-fields">
          <span>Name</span>
          <span>Playbook</span>
          <span>Level</span>
        </div>
      </header>

      <main className="sheet-columns">
        <div className="sheet-column">
          <section className="sheet-section">
            <h2>Stats &amp; Debilities</h2>
          </section>
          <section className="sheet-section">
            <h2>HP, Armor &amp; Damage</h2>
          </section>
          <section className="sheet-section">
            <h2>XP, Bonds &amp; Background</h2>
          </section>
        </div>

        <div className="sheet-column">
          <section className="sheet-section">
            <h2>Moves</h2>
          </section>
          <section className="sheet-section">
            <h2>Spells &amp; Resources</h2>
          </section>
          <section className="sheet-section">
            <h2>Inventory</h2>
          </section>
        </div>
      </main>

      <footer className="sheet-footer">
        <h2>Notes</h2>
      </footer>
    </div>
  );
}
