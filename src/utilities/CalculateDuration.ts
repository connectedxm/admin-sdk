export const CalculateDuration = (durationMilliseconds: number) => {
  if (durationMilliseconds < 1000) {
    return `${Math.round(durationMilliseconds)} ms`;
  } else if (durationMilliseconds < 60) {
    return `${Math.round(durationMilliseconds / 1000)}s`;
  } else {
    const minutes = Math.round(durationMilliseconds / 60000);
    return `${minutes}m`;
  }
};
