import { isUUID, useGetSelfRelationships } from "..";

export const useIsChannelSubscribed = (channelId?: string) => {
  const { data: relationships } = useGetSelfRelationships();

  if (!channelId) return false;
  if (!isUUID(channelId)) {
    throw new Error("Invalid channelId. Did you pass in the slug?");
  }

  return relationships?.data.channels[channelId] || false;
};

export default useIsChannelSubscribed;
