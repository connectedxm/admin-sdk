import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_MESSAGE_VIDEOS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DisconnectThreadMessageVideoParams extends MutationParams {
  threadId: string;
  messageId: string;
  videoId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DisconnectThreadMessageVideo = async ({
  threadId,
  messageId,
  videoId,
  adminApiParams,
  queryClient,
}: DisconnectThreadMessageVideoParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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
export const useDisconnectThreadMessageVideo = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DisconnectThreadMessageVideo>>,
      Omit<DisconnectThreadMessageVideoParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DisconnectThreadMessageVideoParams,
    Awaited<ReturnType<typeof DisconnectThreadMessageVideo>>
  >(DisconnectThreadMessageVideo, options, {
    domain: "threads",
    type: "del",
  });
};
