import { useState } from 'react';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  /**
   * Show an explicit "Done" button and commit ONLY on click, not on blur.
   * Without this, blur already silently commits every time, which makes a
   * "Done" button feel like it does nothing — so showSubmit disables the
   * blur auto-commit and makes the button the one, unambiguous save action.
   */
  showSubmit?: boolean;
}

// A controlled input whose displayed value were `tags.join(', ')` would
// fight the user: typing a space or comma gets immediately re-parsed and
// stripped, so it looks like those characters can't be typed. Instead we
// keep the raw text as local state while editing and only commit it to
// `tags` on blur — or, with showSubmit, only via the Done button.
export default function TagsInput({ value, onChange, placeholder, className, showSubmit }: Props) {
  const [draft, setDraft] = useState(value.join(', '));

  const commit = (text: string) => {
    onChange(
      text
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    );
  };

  return (
    <span className="tags-input">
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          if (!showSubmit) commit(e.target.value);
        }}
      />
      {showSubmit && (
        <button type="button" className="tags-input-submit" onClick={() => commit(draft)}>
          Done
        </button>
      )}
    </span>
  );
}
