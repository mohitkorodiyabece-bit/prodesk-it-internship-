import ConnectionStatus from "./ConnectionStatus";
import { getRoomLabel } from "../constants/rooms";

function ChatHeader({ username, room, isConnected, onLeave }) {
  return (
    <header className="chat-header">
      <div className="chat-header-info">
        <h1 className="chat-header-title">Sprint 12 Chat</h1>
        <p className="chat-header-meta">
          <span className="chat-header-username">{username}</span>
          <span aria-hidden="true"> · </span>
          <span className="chat-header-room">{getRoomLabel(room)}</span>
        </p>
      </div>

      <div className="chat-header-actions">
        <ConnectionStatus isConnected={isConnected} />
        <button
          type="button"
          className="secondary-button leave-button"
          onClick={onLeave}
        >
          Leave Chat
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;