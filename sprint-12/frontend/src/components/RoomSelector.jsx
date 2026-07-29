import { ROOMS } from "../constants/rooms";

function RoomSelector({ currentRoom, onRoomChange, disabled }) {
  function handleChange(event) {
    const newRoom = event.target.value;
    if (newRoom !== currentRoom) {
      onRoomChange(newRoom);
    }
  }

  return (
    <div className="room-selector">
      <label className="field-label" htmlFor="active-room-select">
        Room
      </label>
      <select
        id="active-room-select"
        className="text-input"
        value={currentRoom}
        onChange={handleChange}
        disabled={disabled}
      >
        {ROOMS.map((roomOption) => (
          <option key={roomOption.value} value={roomOption.value}>
            {roomOption.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RoomSelector;