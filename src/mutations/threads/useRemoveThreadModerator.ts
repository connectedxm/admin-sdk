import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import { THREAD_MODERATORS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface RemoveThreadModeratorParams extends MutationParams {
  threadId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const RemoveThreadModerator = async ({
  threadId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveThreadModeratorParams): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<GroupMembership>
  >(`/threads/${threadId}/moderators/${accountId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MODERATORS_QUERY_KEY(threadId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
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
