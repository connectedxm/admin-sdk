import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadParams extends MutationParams {
  threadId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThread = async ({
  threadId,
  adminApiParams,
  queryClient,
}: DeleteThreadParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ["THREADS"], exact: false });
    queryClient.removeQueries({ queryKey: THREAD_QUERY_KEY(threadId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThread = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThread>>,
      Omit<DeleteThreadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadParams,
    Awaited<ReturnType<typeof DeleteThread>>
  >(DeleteThread, options);
};
