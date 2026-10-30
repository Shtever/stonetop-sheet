import './ui.css';

interface BoxTrackProps {
  total: number;
  marked: number;
  onChange: (marked: number) => void;
  /** 'compact' sizes boxes to text height instead of the 44px tap minimum. */
  size?: 'default' | 'compact';
}

// Tapping box N sets the mark level to N (tap the last marked box to
// un-mark it), matching how a paper track is filled left-to-right.
export default function BoxTrack({ total, marked, onChange, size = 'default' }: BoxTrackProps) {
  return (
    <div className={size === 'compact' ? 'box-track compact' : 'box-track'}>
      {Array.from({ length: total }, (_, i) => {
        const isMarked = i < marked;
        return (
          <button
            key={i}
            type="button"
            className={isMarked ? 'box-track-box marked' : 'box-track-box'}
            aria-label={`Box ${i + 1}${isMarked ? ', marked' : ''}`}
            onClick={() => onChange(i + 1 === marked ? i : i + 1)}
          />
        );
      })}
    </div>
  );
}
