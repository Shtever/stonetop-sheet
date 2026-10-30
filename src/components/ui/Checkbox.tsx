import './ui.css';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 'compact' sizes the box to text height instead of the 44px tap minimum. */
  size?: 'default' | 'compact';
}

export default function Checkbox({ label, checked, onChange, size = 'default' }: CheckboxProps) {
  return (
    <label className={size === 'compact' ? 'paper-checkbox compact' : 'paper-checkbox'}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label && <span>{label}</span>}
    </label>
  );
}
