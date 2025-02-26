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
 * @category Params
 * @group Threads
 */
export interface UpdateThreadParams extends MutationParams {
  threadId: string;
  thread: ThreadUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThread = async ({
  threadId,
  thread,
  adminApiParams,
  queryClient,
}: UpdateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Thread>>(
    `/threads/${threadId}`,
    thread
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY() });
    SET_THREAD_QUERY_DATA(queryClient, [threadId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
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
