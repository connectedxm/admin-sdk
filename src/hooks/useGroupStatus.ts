import { isUUID, useGetSelfRelationships } from "..";

export const useGroupStatus = (
  groupId?: string
): "moderator" | "member" | "requested" | "invited" | false => {
  const { data: relationships } = useGetSelfRelationships();

  if (!groupId) return false;
  if (!isUUID(groupId)) {
    throw new Error("Invalid groupId. Did you pass in the slug?");
  }

  return relationships?.data.groups[groupId] || false;
};

export default useGroupStatus;
