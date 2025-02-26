import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Thread } from "@src/interfaces";
import { THREADS_QUERY_KEY, SET_THREAD_QUERY_DATA } from "@src/queries";
import { ThreadCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Thread
 */
export interface CreatePublicThreadParams extends MutationParams {
  thread: ThreadCreateInputs;
}

/**
 * @category Methods
 * @group Thread
 */
export const CreatePublicThread = async ({
  thread,
  adminApiParams,
  queryClient,
}: CreatePublicThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Thread>>(
    `/threads/public`,
    thread
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY() });
    SET_THREAD_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Thread
 */
export const useCreatePublicThread = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreatePublicThread>>,
      Omit<CreatePublicThreadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreatePublicThreadParams,
    Awaited<ReturnType<typeof CreatePublicThread>>
  >(CreatePublicThread, options, {
    domain: "threads",
    type: "create",
  });
};
