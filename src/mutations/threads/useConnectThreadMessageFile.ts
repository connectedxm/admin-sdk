import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, File } from "@src/interfaces";
import { THREAD_MESSAGE_FILES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface ConnectThreadMessageFileParams extends MutationParams {
  threadId: string;
  messageId: string;
  fileId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const ConnectThreadMessageFile = async ({
  threadId,
  messageId,
  fileId,
  adminApiParams,
  queryClient,
}: ConnectThreadMessageFileParams): Promise<ConnectedXMResponse<File>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<File>>(
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
export const useConnectThreadMessageFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConnectThreadMessageFile>>,
      Omit<ConnectThreadMessageFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConnectThreadMessageFileParams,
    Awaited<ReturnType<typeof ConnectThreadMessageFile>>
  >(ConnectThreadMessageFile, options, {
    domain: "threads",
    type: "update",
  });
};
