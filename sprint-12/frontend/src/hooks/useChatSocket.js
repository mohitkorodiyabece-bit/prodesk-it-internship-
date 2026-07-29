import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../socket";

const TYPING_STOP_DELAY_MS = 1200;

export function useChatSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [typingUsernames, setTypingUsernames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const currentRoomRef = useRef("");

  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  const clearError = useCallback(() => {
    setErrorMessage("");
  }, []);

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true);
    }

    function handleDisconnect() {
      setIsConnected(false);
    }

    function handleReceiveMessage(payload) {
      setMessages((prev) => [...prev, payload]);
    }

    function handleSystemMessage(payload) {
      setMessages((prev) => [...prev, payload]);
    }

    function handleTypingUsers(payload) {
      if (!payload || !Array.isArray(payload.usernames)) {
        setTypingUsernames([]);
        return;
      }

      const uniqueOthers = Array.from(new Set(payload.usernames)).filter(
        (name) => name !== currentUsername
      );

      setTypingUsernames(uniqueOthers);
    }

    function handleChatError(payload) {
      setErrorMessage(payload?.message || "An unknown error occurred.");
    }

    function handleConnectError() {
      setIsConnected(false);
      setErrorMessage("Unable to connect to the chat server.");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("system-message", handleSystemMessage);
    socket.on("typing-users", handleTypingUsers);
    socket.on("chat-error", handleChatError);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("system-message", handleSystemMessage);
      socket.off("typing-users", handleTypingUsers);
      socket.off("chat-error", handleChatError);
      socket.off("connect_error", handleConnectError);
    };
  }, [currentUsername]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTypingRef.current && currentRoomRef.current) {
      isTypingRef.current = false;
      socket.emit("typing-stop", { room: currentRoomRef.current });
    }
  }, []);

  const notifyTyping = useCallback(() => {
    if (!currentRoomRef.current) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing-start", { room: currentRoomRef.current });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, TYPING_STOP_DELAY_MS);
  }, [stopTyping]);

  const joinRoom = useCallback(
    (username, room) => {
      clearError();

      if (!socket.connected) {
        socket.connect();
      }

      setCurrentUsername(username);
      setCurrentRoom(room);
      setMessages([]);
      setTypingUsernames([]);
      setHasJoined(true);

      socket.emit("join-room", { username, room });
    },
    [clearError]
  );

  const switchRoom = useCallback(
    (newRoom) => {
      if (newRoom === currentRoomRef.current) return;

      stopTyping();
      socket.emit("leave-room");

      setMessages([]);
      setTypingUsernames([]);
      clearError();
      setCurrentRoom(newRoom);

      socket.emit("join-room", { username: currentUsername, room: newRoom });
    },
    [currentUsername, clearError, stopTyping]
  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || !currentRoomRef.current) return;

      stopTyping();

      socket.emit("send-message", {
        message: trimmed,
        room: currentRoomRef.current,
      });
    },
    [stopTyping]
  );

  const leaveChat = useCallback(() => {
    stopTyping();
    socket.emit("leave-room");
    socket.disconnect();

    setHasJoined(false);
    setMessages([]);
    setTypingUsernames([]);
    setCurrentUsername("");
    setCurrentRoom("");
    clearError();
  }, [stopTyping, clearError]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && currentRoomRef.current) {
        socket.emit("typing-stop", { room: currentRoomRef.current });
      }
    };
  }, []);

  return {
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
  };
}