import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadMessage = async ({
  threadId,
  messageId,
  adminApiParams,
  queryClient,
}: DeleteThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages/${messageId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGES_QUERY_KEY(threadId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThreadMessage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThreadMessage>>,
      Omit<DeleteThreadMessageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMessageParams,
    Awaited<ReturnType<typeof DeleteThreadMessage>>
  >(DeleteThreadMessage, options);
};
