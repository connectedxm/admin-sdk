import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_MESSAGE_FILES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DisconnectThreadMessageFileParams extends MutationParams {
  threadId: string;
  messageId: string;
  fileId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DisconnectThreadMessageFile = async ({
  threadId,
  messageId,
  fileId,
  adminApiParams,
  queryClient,
}: DisconnectThreadMessageFileParams): Promise<ConnectedXMResponse<null>> => {
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
export const useDisconnectThreadMessageFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DisconnectThreadMessageFile>>,
      Omit<DisconnectThreadMessageFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DisconnectThreadMessageFileParams,
    Awaited<ReturnType<typeof DisconnectThreadMessageFile>>
  >(DisconnectThreadMessageFile, options, {
    domain: "threads",
    type: "del",
  });
};
