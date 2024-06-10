import { isUUID, useGetSelfRelationships } from "..";

export const useIsEventRegistered = (eventId: string) => {
  const { data: relationships } = useGetSelfRelationships();

  if (!eventId) return false;
  if (!isUUID(eventId)) {
    throw new Error("Invalid eventId. Did you pass in the slug?");
  }

  return relationships?.data.events[eventId] || false;
};

export default useIsEventRegistered;
