// utils/timeFormatter.js
export const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) {
    return '00:00';
  }

  // Convert to integer
  const totalSeconds = Math.floor(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // Format with leading zeros
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
