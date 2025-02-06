import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import { THREAD_MODERATORS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a moderator from a specific thread.
 * This function allows the removal of a user's moderator role from a thread by specifying the thread and account IDs.
 * It is useful in scenarios where thread moderation needs to be managed dynamically.
 * @name RemoveThreadModerator
 * @param {string} threadId (path) The id of the thread
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export interface RemoveThreadModeratorParams extends MutationParams {
  threadId: string;
  accountId: string;
}

export const RemoveThreadModerator = async ({
  threadId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveThreadModeratorParams): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<GroupMembership>>(
    `/threads/${threadId}/moderators/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MODERATORS_QUERY_KEY(threadId),
    });
  }
  return data;
};

export const useRemoveThreadModerator = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveThreadModerator>>,
      Omit<RemoveThreadModeratorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadModeratorParams,
    Awaited<ReturnType<typeof RemoveThreadModerator>>
  >(RemoveThreadModerator, options, {
    domain: "threads",
    type: "update",
  });
};
