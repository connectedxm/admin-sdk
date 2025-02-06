import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREADS_QUERY_KEY, THREAD_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific thread by its unique identifier.
 * This function allows for the removal of a thread from the system, ensuring that associated cache entries are invalidated.
 * It is designed to be used in applications where thread management and cleanup are required.
 * @name DeleteThread
 * @param {string} threadId (path) The id of the thread to be deleted
 * @version 1.3
 **/

export interface DeleteThreadParams extends MutationParams {
  threadId: string;
}

export const DeleteThread = async ({
  threadId,
  adminApiParams,
  queryClient,
}: DeleteThreadParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: THREAD_QUERY_KEY(threadId) });
  }
  return data;
};

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
  >(DeleteThread, options, {
    domain: "threads",
    type: "del",
  });
};
