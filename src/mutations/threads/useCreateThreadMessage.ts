import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  accountId: string;
  text: string;
  entities: any[];
  replyToId?: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadMessage = async ({
  threadId,
  accountId,
  text,
  entities,
  replyToId,
  adminApiParams,
  queryClient,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages`,
    {
      accountId,
      text,
      entities,
      replyToId,
    }
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
export const useCreateThreadMessage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadMessage>>,
      Omit<CreateThreadMessageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageParams,
    Awaited<ReturnType<typeof CreateThreadMessage>>
  >(CreateThreadMessage, options, {
    domain: "threads",
    type: "create",
  });
};
