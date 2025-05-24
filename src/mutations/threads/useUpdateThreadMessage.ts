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
export interface UpdateThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
  text: string;
  entities: any[];
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadMessage = async ({
  threadId,
  messageId,
  text,
  adminApiParams,
  queryClient,
}: UpdateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages/${messageId}`,
    {
      text,
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
export const useUpdateThreadMessage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateThreadMessage>>,
      Omit<UpdateThreadMessageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadMessageParams,
    Awaited<ReturnType<typeof UpdateThreadMessage>>
  >(UpdateThreadMessage, options, {
    domain: "threads",
    type: "update",
  });
};
