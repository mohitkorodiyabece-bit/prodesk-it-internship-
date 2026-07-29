import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

function MessageList({ messages, currentUsername }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list-empty">
        <p>No messages yet. Say hello!</p>
      </div>
    );
  }

  return (
    <ul className="message-list" aria-live="polite">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwnMessage={
            message.type === "message" && message.username === currentUsername
          }
        />
      ))}
      <div ref={bottomRef} />
    </ul>
  );
}

export default MessageList;