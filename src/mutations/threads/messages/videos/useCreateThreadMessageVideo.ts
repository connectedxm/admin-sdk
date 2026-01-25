import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGE_VIDEOS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadMessageVideoParams extends MutationParams {
  threadId: string;
  messageId: string;
  videoId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadMessageVideo = async ({
  threadId,
  messageId,
  videoId,
  adminApiParams,
  queryClient,
}: CreateThreadMessageVideoParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMessage>>(
    `/threads/${threadId}/messages/${messageId}/videos/${videoId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGE_VIDEOS_QUERY_KEY(threadId, messageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useCreateThreadMessageVideo = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadMessageVideo>>,
      Omit<CreateThreadMessageVideoParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageVideoParams,
    Awaited<ReturnType<typeof CreateThreadMessageVideo>>
  >(CreateThreadMessageVideo, options);
};
