import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Video } from "@src/interfaces";
import { THREAD_MESSAGE_VIDEOS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface ConnectThreadMessageVideoParams extends MutationParams {
  threadId: string;
  messageId: string;
  videoId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const ConnectThreadMessageVideo = async ({
  threadId,
  messageId,
  videoId,
  adminApiParams,
  queryClient,
}: ConnectThreadMessageVideoParams): Promise<ConnectedXMResponse<Video>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Video>>(
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
export const useConnectThreadMessageVideo = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConnectThreadMessageVideo>>,
      Omit<ConnectThreadMessageVideoParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConnectThreadMessageVideoParams,
    Awaited<ReturnType<typeof ConnectThreadMessageVideo>>
  >(ConnectThreadMessageVideo, options, {
    domain: "threads",
    type: "update",
  });
};
