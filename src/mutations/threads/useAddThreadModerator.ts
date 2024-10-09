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
 * @category Params
 * @group Threads
 */
export interface AddThreadModeratorParams extends MutationParams {
  threadId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const AddThreadModerator = async ({
  threadId,
  accountId,
  adminApiParams,
  queryClient,
}: AddThreadModeratorParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMember>>(
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

/**
 * @category Mutations
 * @group Threads
 */
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
