import './ui.css';

interface InlineFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

// Looks like printed text until tapped; no visible "edit mode" chrome.
export default function InlineField({ label, value, placeholder, onChange }: InlineFieldProps) {
  return (
    <label className="inline-field">
      <span className="inline-field-label">{label}</span>
      <input
        className="inline-field-input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
