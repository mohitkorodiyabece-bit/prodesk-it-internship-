export const ROOMS = [
  { value: "general", label: "General" },
  { value: "developers", label: "Developers" },
];

export const DEFAULT_ROOM = "general";

export function getRoomLabel(roomValue) {
  const found = ROOMS.find((room) => room.value === roomValue);
  return found ? found.label : roomValue;
}

export function isValidRoomValue(roomValue) {
  return ROOMS.some((room) => room.value === roomValue);
}