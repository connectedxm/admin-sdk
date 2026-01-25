import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGE_FILES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadMessageFileParams extends MutationParams {
  threadId: string;
  messageId: string;
  fileId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadMessageFile = async ({
  threadId,
  messageId,
  fileId,
  adminApiParams,
  queryClient,
}: CreateThreadMessageFileParams): Promise<
  ConnectedXMResponse<ThreadMessage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMessage>>(
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
export const useCreateThreadMessageFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadMessageFile>>,
      Omit<CreateThreadMessageFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageFileParams,
    Awaited<ReturnType<typeof CreateThreadMessageFile>>
  >(CreateThreadMessageFile, options);
};
