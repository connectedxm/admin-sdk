import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import {
  THREAD_MEMBERS_QUERY_KEY,
  THREAD_MODERATORS_QUERY_KEY,
} from "@src/queries";

/**
 * Adds a member as a moderator to a specified thread and invalidates relevant queries.
 * This function is used to promote a thread member to a moderator role within a thread,
 * ensuring that the thread's moderator and member data are updated accordingly.
 * It is designed for applications that manage user roles within discussion threads.
 * @name AddThreadModerator
 * @param {string} threadId (path) - The id of the thread
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/

export interface AddThreadModeratorParams extends MutationParams {
  threadId: string;
  accountId: string;
}

export const AddThreadModerator = async ({
  threadId,
  accountId,
  adminApiParams,
  queryClient,
}: AddThreadModeratorParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<ThreadMember>>(
    `/threads/${threadId}/moderators/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MODERATORS_QUERY_KEY(threadId),
    });
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
  }
  return data;
};

export const useAddThreadModerator = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddThreadModerator>>,
      Omit<AddThreadModeratorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddThreadModeratorParams,
    Awaited<ReturnType<typeof AddThreadModerator>>
  >(AddThreadModerator, options, {
    domain: "threads",
    type: "update",
  });
};