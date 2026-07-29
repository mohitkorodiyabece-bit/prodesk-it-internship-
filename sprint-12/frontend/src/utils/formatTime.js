export function formatTime(isoString) {
  if (!isoString) return "";

  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (err) {
    return "";
  }
}