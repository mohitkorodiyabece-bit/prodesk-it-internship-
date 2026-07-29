const ROOMS = ["general", "developers"];

const ROOM_LABELS = {
  general: "General",
  developers: "Developers",
};

const DEFAULT_ROOM = "general";

function isValidRoom(room) {
  return typeof room === "string" && ROOMS.includes(room);
}

module.exports = {
  ROOMS,
  ROOM_LABELS,
  DEFAULT_ROOM,
  isValidRoom,
};