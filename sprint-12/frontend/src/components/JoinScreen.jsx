import { useState } from "react";
import { ROOMS, DEFAULT_ROOM } from "../constants/rooms";
import ErrorMessage from "./ErrorMessage";

function JoinScreen({ onJoin, errorMessage, clearError }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(DEFAULT_ROOM);
  const [localError, setLocalError] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
    if (localError) setLocalError("");
    if (errorMessage) clearError();
  }

  function handleRoomChange(event) {
    setRoom(event.target.value);
  }

  function validateAndJoin() {
    const trimmed = username.trim();

    if (trimmed.length === 0) {
      setLocalError("Username is required.");
      return;
    }

    if (trimmed.length < 2) {
      setLocalError("Username must be at least 2 characters.");
      return;
    }

    if (trimmed.length > 25) {
      setLocalError("Username must be no more than 25 characters.");
      return;
    }

    setLocalError("");
    onJoin(trimmed, room);
  }

  function handleSubmit(event) {
    event.preventDefault();
    validateAndJoin();
  }

  const displayedError = localError || errorMessage;

  return (
    <div className="join-screen">
      <div className="join-card">
        <span className="join-eyebrow">
          <span className="join-eyebrow-dot" aria-hidden="true"></span>
          Live · Socket.IO
        </span>
        <h1 className="join-title">Sprint 12 — Real-Time Chat</h1>
        <p className="join-subtitle">Enter a username and choose a room to get started.</p>

        <form className="join-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="username-input">
            Username
          </label>
          <input
            id="username-input"
            name="username"
            type="text"
            className="text-input"
            placeholder="e.g. Mohit"
            value={username}
            onChange={handleUsernameChange}
            maxLength={25}
            autoComplete="off"
          />

          <label className="field-label" htmlFor="room-select">
            Room
          </label>
          <select
            id="room-select"
            name="room"
            className="text-input"
            value={room}
            onChange={handleRoomChange}
          >
            {ROOMS.map((roomOption) => (
              <option key={roomOption.value} value={roomOption.value}>
                {roomOption.label}
              </option>
            ))}
          </select>

          <button type="submit" className="primary-button join-button">
            Join Chat
          </button>
        </form>

        <ErrorMessage message={displayedError} />
      </div>
    </div>
  );
}

export default JoinScreen;