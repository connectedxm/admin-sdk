import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Thread } from "@src/interfaces";
import { ThreadCreateInputs } from "@src/params";
import { GROUP_THREADS_QUERY_KEY } from "@src/queries";
import { THREAD_CIRCLE_THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleThreads";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadParams extends MutationParams {
  thread: ThreadCreateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThread = async ({
  thread,
  adminApiParams,
  queryClient,
}: CreateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Thread>>(
    `/threads`,
    thread
  );
  if (queryClient && data.status === "ok") {
    // Invalidate any group threads lists if applicable
    if (thread.groupId) {
      queryClient.invalidateQueries({
        queryKey: GROUP_THREADS_QUERY_KEY(thread.groupId),
      });
    }

    // Invalidate circle threads if applicable
    if (thread.circleId) {
      queryClient.invalidateQueries({
        queryKey: THREAD_CIRCLE_THREADS_QUERY_KEY(thread.circleId),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useCreateThread = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThread>>,
      Omit<CreateThreadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadParams,
    Awaited<ReturnType<typeof CreateThread>>
  >(CreateThread, options, {
    domain: "threads",
    type: "create",
  });
};
