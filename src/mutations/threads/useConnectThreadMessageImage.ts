import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { THREAD_MESSAGE_IMAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface ConnectThreadMessageImageParams extends MutationParams {
  threadId: string;
  messageId: string;
  imageId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const ConnectThreadMessageImage = async ({
  threadId,
  messageId,
  imageId,
  adminApiParams,
  queryClient,
}: ConnectThreadMessageImageParams): Promise<ConnectedXMResponse<Image>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Image>>(
    `/threads/${threadId}/messages/${messageId}/images/${imageId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGE_IMAGES_QUERY_KEY(threadId, messageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useConnectThreadMessageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConnectThreadMessageImage>>,
      Omit<ConnectThreadMessageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConnectThreadMessageImageParams,
    Awaited<ReturnType<typeof ConnectThreadMessageImage>>
  >(ConnectThreadMessageImage, options, {
    domain: "threads",
    type: "update",
  });
};
