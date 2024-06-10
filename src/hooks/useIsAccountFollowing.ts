import { isUUID, useGetSelfRelationships } from "..";

export const useIsAccountFollowing = (accountId?: string) => {
  const { data: relationships } = useGetSelfRelationships();

  if (!accountId) return false;
  if (!isUUID(accountId)) {
    throw new Error("Invalid accountId. Did you pass in the username?");
  }

  return relationships?.data.accounts[accountId] || false;
};

export default useIsAccountFollowing;
