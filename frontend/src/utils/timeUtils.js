export const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const convertMinutesToTime = (minutes) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
};

export const formatTime = (minutes) => {
  return `${Math.floor(minutes / 60)}:${(minutes % 60 === 0 ? "00" : minutes % 60)}`;
};