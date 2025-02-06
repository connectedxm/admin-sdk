import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Thread, ConnectedXMResponse } from "@src/interfaces";
import { THREADS_QUERY_KEY, SET_THREAD_QUERY_DATA } from "@src/queries";
import { ThreadUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing thread with new data.
 * This function allows users to modify the details of a specific thread by providing the thread ID and the updated data.
 * It supports optional image data URI for updating the thread's image.
 * The function ensures that the thread data is updated in the cache if the operation is successful.
 * @name UpdateThread
 * @param {string} threadId (path) The id of the thread
 * @param {ThreadUpdateInputs} thread (bodyValue) The thread data to update
 * @param {string} [imageDataUri] (bodyValue) Optional image data URI
 * @version 1.3
 **/
export interface UpdateThreadParams extends MutationParams {
  threadId: string;
  thread: ThreadUpdateInputs;
  imageDataUri?: string;
}

export const UpdateThread = async ({
  threadId,
  thread,
  imageDataUri,
  adminApiParams,
  queryClient,
}: UpdateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Thread>>(
    `/threads/${threadId}`,
    {
      thread,
      imageDataUri,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY() });
    SET_THREAD_QUERY_DATA(queryClient, [threadId], data);
  }
  return data;
};

export const useUpdateThread = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateThread>>,
      Omit<UpdateThreadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadParams,
    Awaited<ReturnType<typeof UpdateThread>>
  >(UpdateThread, options, {
    domain: "threads",
    type: "update",
  });
};
