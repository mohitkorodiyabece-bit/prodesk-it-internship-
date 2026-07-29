function ConnectionStatus({ isConnected }) {
  const statusClass = isConnected
    ? "connection-status connected"
    : "connection-status disconnected";

  return (
    <span className={statusClass} role="status">
      <span className="connection-dot" aria-hidden="true"></span>
      {isConnected ? "Connected" : "Disconnected"}
    </span>
  );
}

export default ConnectionStatus;