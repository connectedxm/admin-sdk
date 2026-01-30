import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_MESSAGE_REACTIONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  reactionId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadMessageReaction = async ({
  threadId,
  messageId,
  reactionId,
  adminApiParams,
  queryClient,
}: DeleteThreadMessageReactionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}/messages/${messageId}/reactions/${reactionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGE_REACTIONS_QUERY_KEY(threadId, messageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThreadMessageReaction = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThreadMessageReaction>>,
      Omit<DeleteThreadMessageReactionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMessageReactionParams,
    Awaited<ReturnType<typeof DeleteThreadMessageReaction>>
  >(DeleteThreadMessageReaction, options);
};
