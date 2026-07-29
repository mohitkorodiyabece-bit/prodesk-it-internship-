import JoinScreen from "./components/JoinScreen";
import ChatLayout from "./components/ChatLayout";
import { useChatSocket } from "./hooks/useChatSocket";
import "./App.css";

function App() {
  const {
    isConnected,
    messages,
    typingUsernames,
    errorMessage,
    currentUsername,
    currentRoom,
    hasJoined,
    joinRoom,
    switchRoom,
    sendMessage,
    notifyTyping,
    stopTyping,
    leaveChat,
    clearError,
  } = useChatSocket();

  if (!hasJoined) {
    return (
      <JoinScreen
        onJoin={joinRoom}
        errorMessage={errorMessage}
        clearError={clearError}
      />
    );
  }

  return (
    <ChatLayout
      username={currentUsername}
      room={currentRoom}
      isConnected={isConnected}
      messages={messages}
      typingUsernames={typingUsernames}
      errorMessage={errorMessage}
      onRoomChange={switchRoom}
      onSend={sendMessage}
      onTyping={notifyTyping}
      onStopTyping={stopTyping}
      onLeave={leaveChat}
    />
  );
}

export default App;