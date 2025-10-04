import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadMessageReaction } from "@src/interfaces";
import { THREAD_MESSAGE_REACTIONS_QUERY_KEY } from "@src/queries";
import { ThreadMessageReactionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  accountId: string;
  reaction: ThreadMessageReactionCreateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadMessageReaction = async ({
  threadId,
  messageId,
  accountId,
  reaction,
  adminApiParams,
  queryClient,
}: CreateThreadMessageReactionParams): Promise<
  ConnectedXMResponse<ThreadMessageReaction>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<ThreadMessageReaction>
  >(`/threads/${threadId}/messages/${messageId}/reactions`, {
    accountId,
    ...reaction,
  });
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
export const useCreateThreadMessageReaction = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadMessageReaction>>,
      Omit<CreateThreadMessageReactionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageReactionParams,
    Awaited<ReturnType<typeof CreateThreadMessageReaction>>
  >(CreateThreadMessageReaction, options);
};
