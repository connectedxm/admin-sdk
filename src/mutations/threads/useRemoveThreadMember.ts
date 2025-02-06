import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import { THREAD_MEMBERS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a member from a specific thread.
 * This function facilitates the removal of a user from a thread by specifying the thread and account IDs.
 * It is intended for use in applications where thread membership management is required.
 * @name RemoveThreadMember
 * @param {string} threadId (path) - The id of the thread
 * @param {string} accountId (path) - The id of the account to be removed
 * @version 1.3
 **/

export interface RemoveThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
}

export const RemoveThreadMember = async ({
  threadId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveThreadMemberParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<GroupMembership>>(
    `/threads/${threadId}/members/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
  }
  return data;
};

export const useRemoveThreadMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveThreadMember>>,
      Omit<RemoveThreadMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadMemberParams,
    Awaited<ReturnType<typeof RemoveThreadMember>>
  >(RemoveThreadMember, options, {
    domain: "threads",
    type: "update",
  });
};