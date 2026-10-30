import './ui.css';

interface TabsProps {
  tabs: readonly string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === active}
          className={tab === active ? 'tab active' : 'tab'}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
