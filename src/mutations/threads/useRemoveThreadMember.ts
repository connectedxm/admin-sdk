import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import { THREAD_MEMBERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @thread Threads
 */
export interface RemoveThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
}

/**
 * @category Methods
 * @thread Threads
 */
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

/**
 * @category Mutations
 * @thread Threads
 */
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
