import { useState } from 'react';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

// A controlled input whose displayed value were `tags.join(', ')` would
// fight the user: typing a space or comma gets immediately re-parsed and
// stripped, so it looks like those characters can't be typed. Instead we
// keep the raw text as local state while editing and only commit it to
// `tags` on blur.
export default function TagsInput({ value, onChange, placeholder, className }: Props) {
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
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={(e) => commit(e.target.value)}
    />
  );
}
