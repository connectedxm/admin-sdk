export const CalculateDuration = (durationMilliseconds: number) => {
  if (durationMilliseconds < 1000) {
    return `${Math.round(durationMilliseconds)} ms`;
  } else if (durationMilliseconds < 60000) {
    return `${Math.round(durationMilliseconds / 1000)}s`;
  } else {
    const minutes = Math.floor(durationMilliseconds / 60000);
    const seconds = Math.round((durationMilliseconds % 60000) / 1000);

    if (seconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }
};
