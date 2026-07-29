import { buildTypingText } from "../utils/typingText";

function TypingIndicator({ typingUsernames }) {
  const text = buildTypingText(typingUsernames);

  if (!text) {
    return (
      <div className="typing-indicator" aria-live="polite">
        &nbsp;
      </div>
    );
  }

  return (
    <div className="typing-indicator" aria-live="polite">
      <span className="typing-indicator-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span>{text}</span>
    </div>
  );
}

export default TypingIndicator;