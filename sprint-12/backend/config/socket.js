const { Server } = require("socket.io");
const { ROOMS, isValidRoom } = require("../constants/rooms");
const {
  validateJoinPayload,
  validateMessagePayload,
} = require("../utils/validation");
const {
  createChatMessage,
  createSystemMessage,
} = require("../utils/messageUtils");

const TYPING_STOP_SAFETY_MS = 5000;

function initializeSocket(server, clientUrl) {
  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const typingUsersByRoom = new Map();
  const typingSafetyTimers = new Map();

  function getTypingSet(room) {
    if (!typingUsersByRoom.has(room)) {
      typingUsersByRoom.set(room, new Map());
    }
    return typingUsersByRoom.get(room);
  }

  function broadcastTypingUsers(room) {
    const typingMap = getTypingSet(room);
    const usernames = Array.from(typingMap.values());
    io.to(room).emit("typing-users", { room, usernames });
  }

  function clearTypingSafetyTimer(socketId) {
    const existing = typingSafetyTimers.get(socketId);
    if (existing) {
      clearTimeout(existing);
      typingSafetyTimers.delete(socketId);
    }
  }

  function removeTypingUser(socket, room) {
    if (!room) return;
    const typingMap = getTypingSet(room);
    if (typingMap.has(socket.id)) {
      typingMap.delete(socket.id);
      broadcastTypingUsers(room);
    }
    clearTypingSafetyTimer(socket.id);
  }

  function addTypingUser(socket, room, username) {
    if (!room) return;
    const typingMap = getTypingSet(room);
    typingMap.set(socket.id, username);
    broadcastTypingUsers(room);

    clearTypingSafetyTimer(socket.id);
    const timer = setTimeout(() => {
      removeTypingUser(socket, room);
    }, TYPING_STOP_SAFETY_MS);
    typingSafetyTimers.set(socket.id, timer);
  }

  function leaveCurrentRoom(socket, notifyOthers) {
    const session = socket.data.session;
    if (!session || !session.room) return;

    const { room, username } = session;

    removeTypingUser(socket, room);
    socket.leave(room);

    if (notifyOthers) {
      const systemMessage = createSystemMessage({
        room,
        text: `${username} left the room`,
      });
      io.to(room).emit("system-message", systemMessage);
    }

    socket.data.session.room = null;
  }

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.data.session = {
      username: null,
      room: null,
    };

    socket.on("join-room", (payload) => {
      try {
        const result = validateJoinPayload(payload);

        if (!result.valid) {
          socket.emit("chat-error", { message: result.error });
          return;
        }

        const { username, room } = result.value;

        if (socket.data.session.room) {
          leaveCurrentRoom(socket, true);
        }

        socket.data.session.username = username;
        socket.data.session.room = room;

        socket.join(room);

        const joinMessage = createSystemMessage({
          room,
          text: `${username} joined the room`,
        });
        io.to(room).emit("system-message", joinMessage);

        broadcastTypingUsers(room);
      } catch (err) {
        console.error("Error handling join-room:", err);
        socket.emit("chat-error", { message: "Failed to join room." });
      }
    });

    socket.on("leave-room", () => {
      try {
        if (!socket.data.session.room) {
          return;
        }
        leaveCurrentRoom(socket, true);
      } catch (err) {
        console.error("Error handling leave-room:", err);
        socket.emit("chat-error", { message: "Failed to leave room." });
      }
    });

    socket.on("send-message", (payload) => {
      try {
        const session = socket.data.session;

        if (!session.username || !session.room) {
          socket.emit("chat-error", {
            message: "You must join a room before sending messages.",
          });
          return;
        }

        const result = validateMessagePayload(payload);

        if (!result.valid) {
          socket.emit("chat-error", { message: result.error });
          return;
        }

        const { message, room } = result.value;

        if (room !== session.room) {
          socket.emit("chat-error", {
            message: "Message room does not match your current room.",
          });
          return;
        }

        const chatMessage = createChatMessage({
          username: session.username,
          message,
          room,
        });

        io.to(room).emit("receive-message", chatMessage);

        removeTypingUser(socket, room);
      } catch (err) {
        console.error("Error handling send-message:", err);
        socket.emit("chat-error", { message: "Failed to send message." });
      }
    });

    socket.on("typing-start", (payload) => {
      try {
        const session = socket.data.session;

        if (!session.username || !session.room) {
          return;
        }

        if (!payload || !isValidRoom(payload.room) || payload.room !== session.room) {
          return;
        }

        addTypingUser(socket, session.room, session.username);
      } catch (err) {
        console.error("Error handling typing-start:", err);
      }
    });

    socket.on("typing-stop", (payload) => {
      try {
        const session = socket.data.session;

        if (!session.room) {
          return;
        }

        if (payload && payload.room && payload.room !== session.room) {
          return;
        }

        removeTypingUser(socket, session.room);
      } catch (err) {
        console.error("Error handling typing-stop:", err);
      }
    });

    socket.on("disconnect", () => {
      try {
        console.log(`Client disconnected: ${socket.id}`);
        leaveCurrentRoom(socket, true);
        clearTypingSafetyTimer(socket.id);
      } catch (err) {
        console.error("Error handling disconnect:", err);
      }
    });

    socket.on("error", (err) => {
      console.error(`Socket error for ${socket.id}:`, err);
    });
  });

  return io;
}

module.exports = initializeSocket;