import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGE_IMAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadMessageImageParams extends MutationParams {
  threadId: string;
  messageId: string;
  imageId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadMessageImage = async ({
  threadId,
  messageId,
  imageId,
  adminApiParams,
  queryClient,
}: CreateThreadMessageImageParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMessage>>(
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
export const useCreateThreadMessageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadMessageImage>>,
      Omit<CreateThreadMessageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageImageParams,
    Awaited<ReturnType<typeof CreateThreadMessageImage>>
  >(CreateThreadMessageImage, options);
};
