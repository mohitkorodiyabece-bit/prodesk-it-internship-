import { formatTime } from "../utils/formatTime";

function MessageItem({ message, isOwnMessage }) {
  if (message.type === "system") {
    return (
      <li className="message-item system-message">
        <span className="system-message-text">{message.message}</span>
      </li>
    );
  }

  const itemClassName = isOwnMessage
    ? "message-item own-message"
    : "message-item other-message";

  return (
    <li className={itemClassName}>
      <div className="message-bubble">
        <div className="message-meta">
          <span className="message-username">{message.username}</span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <p className="message-text">{message.message}</p>
      </div>
    </li>
  );
}

export default MessageItem;