import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_MESSAGE_IMAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadMessageImageParams extends MutationParams {
  threadId: string;
  messageId: string;
  imageId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadMessageImage = async ({
  threadId,
  messageId,
  imageId,
  adminApiParams,
  queryClient,
}: DeleteThreadMessageImageParams): Promise<ConnectedXMResponse<null>> => {
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
export const useDeleteThreadMessageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThreadMessageImage>>,
      Omit<DeleteThreadMessageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMessageImageParams,
    Awaited<ReturnType<typeof DeleteThreadMessageImage>>
  >(DeleteThreadMessageImage, options);
};
