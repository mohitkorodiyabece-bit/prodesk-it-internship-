import { useState } from 'react';

export default function MoodMatcher({ onMoodSubmit, isLoading, error }) {
  const [moodInput, setMoodInput] = useState('');

  const handleChange = (event) => {
    setMoodInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedMood = moodInput.trim();
    if (!trimmedMood || isLoading) return;
    onMoodSubmit(trimmedMood);
  };

  return (
    <div className="mood-matcher">
      <form className="mood-matcher-form" onSubmit={handleSubmit}>
        <label className="mood-matcher-label" htmlFor="mood-matcher-input">
          How are you feeling?
        </label>
        <input
          id="mood-matcher-input"
          type="text"
          className="mood-matcher-input"
          value={moodInput}
          onChange={handleChange}
          placeholder="e.g. nostalgic, adventurous, dark mystery…"
          autoComplete="off"
          aria-busy={isLoading}
        />
        <button
          type="submit"
          className="mood-matcher-submit"
          disabled={isLoading || !moodInput.trim()}
        >
          {isLoading ? 'Finding a match…' : 'Find my movie'}
        </button>
      </form>
      {error && (
        <p className="mood-matcher-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}