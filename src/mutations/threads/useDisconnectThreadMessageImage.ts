import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_MESSAGE_IMAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DisconnectThreadMessageImageParams extends MutationParams {
  threadId: string;
  messageId: string;
  imageId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DisconnectThreadMessageImage = async ({
  threadId,
  messageId,
  imageId,
  adminApiParams,
  queryClient,
}: DisconnectThreadMessageImageParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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
export const useDisconnectThreadMessageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DisconnectThreadMessageImage>>,
      Omit<DisconnectThreadMessageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DisconnectThreadMessageImageParams,
    Awaited<ReturnType<typeof DisconnectThreadMessageImage>>
  >(DisconnectThreadMessageImage, options, {
    domain: "threads",
    type: "del",
  });
};
