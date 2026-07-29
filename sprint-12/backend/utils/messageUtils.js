const crypto = require("crypto");

function generateMessageId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createChatMessage({ username, message, room }) {
  return {
    id: generateMessageId(),
    type: "message",
    username,
    message,
    room,
    timestamp: new Date().toISOString(),
  };
}

function createSystemMessage({ room, text }) {
  return {
    id: generateMessageId(),
    type: "system",
    username: "System",
    message: text,
    room,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  generateMessageId,
  createChatMessage,
  createSystemMessage,
};