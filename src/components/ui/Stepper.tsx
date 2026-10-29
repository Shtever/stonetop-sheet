import './ui.css';

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function Stepper({ label, value, min = 0, max = Infinity, onChange }: StepperProps) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Decrease ${label}`}>
          −
        </button>
        <span className="stepper-value">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`Increase ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}
