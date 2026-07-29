import { useState } from "react";

function MessageInput({ onSend, onTyping, onStopTyping, disabled }) {
  const [text, setText] = useState("");

  function handleChange(event) {
    const value = event.target.value;
    setText(value);

    if (value.trim().length > 0) {
      onTyping();
    } else {
      onStopTyping();
    }
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText("");
    onStopTyping();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="message-input-row">
      <label htmlFor="message-input" className="visually-hidden">
        Message
      </label>
      <input
        id="message-input"
        type="text"
        className="text-input message-input"
        placeholder={disabled ? "Reconnecting..." : "Type a message..."}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={500}
        autoComplete="off"
      />
      <button
        type="button"
        className="primary-button send-button"
        onClick={handleSend}
        disabled={disabled || text.trim().length === 0}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;