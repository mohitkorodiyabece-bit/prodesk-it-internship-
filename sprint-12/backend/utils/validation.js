const { isValidRoom } = require("../constants/rooms");

const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 25;
const MESSAGE_MAX_LENGTH = 500;

function validateUsername(username) {
  if (typeof username !== "string") {
    return { valid: false, error: "Username must be text." };
  }

  const trimmed = username.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Username is required." };
  }

  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} characters.`,
    };
  }

  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must be no more than ${USERNAME_MAX_LENGTH} characters.`,
    };
  }

  return { valid: true, value: trimmed };
}

function validateRoom(room) {
  if (typeof room !== "string") {
    return { valid: false, error: "Room must be text." };
  }

  const trimmed = room.trim();

  if (!isValidRoom(trimmed)) {
    return { valid: false, error: "Selected room does not exist." };
  }

  return { valid: true, value: trimmed };
}

function validateMessageText(message) {
  if (typeof message !== "string") {
    return { valid: false, error: "Message must be text." };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > MESSAGE_MAX_LENGTH) {
    return {
      valid: false,
      error: `Message cannot exceed ${MESSAGE_MAX_LENGTH} characters.`,
    };
  }

  return { valid: true, value: trimmed };
}

function validateJoinPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Malformed join payload." };
  }

  const usernameResult = validateUsername(payload.username);
  if (!usernameResult.valid) {
    return { valid: false, error: usernameResult.error };
  }

  const roomResult = validateRoom(payload.room);
  if (!roomResult.valid) {
    return { valid: false, error: roomResult.error };
  }

  return {
    valid: true,
    value: {
      username: usernameResult.value,
      room: roomResult.value,
    },
  };
}

function validateMessagePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Malformed message payload." };
  }

  const messageResult = validateMessageText(payload.message);
  if (!messageResult.valid) {
    return { valid: false, error: messageResult.error };
  }

  const roomResult = validateRoom(payload.room);
  if (!roomResult.valid) {
    return { valid: false, error: roomResult.error };
  }

  return {
    valid: true,
    value: {
      message: messageResult.value,
      room: roomResult.value,
    },
  };
}

module.exports = {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  validateUsername,
  validateRoom,
  validateMessageText,
  validateJoinPayload,
  validateMessagePayload,
};