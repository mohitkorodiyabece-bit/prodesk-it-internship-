import ChatHeader from "./ChatHeader";
import RoomSelector from "./RoomSelector";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import ErrorMessage from "./ErrorMessage";

function ChatLayout({
  username,
  room,
  isConnected,
  messages,
  typingUsernames,
  errorMessage,
  onRoomChange,
  onSend,
  onTyping,
  onStopTyping,
  onLeave,
}) {
  return (
    <div className="chat-layout">
      <ChatHeader
        username={username}
        room={room}
        isConnected={isConnected}
        onLeave={onLeave}
      />

      <div className="chat-toolbar">
        <RoomSelector
          currentRoom={room}
          onRoomChange={onRoomChange}
          disabled={!isConnected}
        />
      </div>

      <ErrorMessage message={errorMessage} />

      <main className="chat-body">
        <MessageList messages={messages} currentUsername={username} />
      </main>

      <TypingIndicator typingUsernames={typingUsernames} />

      <footer className="chat-footer">
        <MessageInput
          onSend={onSend}
          onTyping={onTyping}
          onStopTyping={onStopTyping}
          disabled={!isConnected}
        />
      </footer>
    </div>
  );
}

export default ChatLayout;