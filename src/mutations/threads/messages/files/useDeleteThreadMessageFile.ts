import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_MESSAGE_FILES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadMessageFileParams extends MutationParams {
  threadId: string;
  messageId: string;
  fileId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadMessageFile = async ({
  threadId,
  messageId,
  fileId,
  adminApiParams,
  queryClient,
}: DeleteThreadMessageFileParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}/messages/${messageId}/files/${fileId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGE_FILES_QUERY_KEY(threadId, messageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThreadMessageFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThreadMessageFile>>,
      Omit<DeleteThreadMessageFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMessageFileParams,
    Awaited<ReturnType<typeof DeleteThreadMessageFile>>
  >(DeleteThreadMessageFile, options);
};
