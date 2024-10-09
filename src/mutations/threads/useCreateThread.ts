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
export interface CreateThreadParams extends MutationParams {
  thread: ThreadCreateInputs;
  accountIds?: string[];
  firstMessage?: string;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Thread
 */
export const CreateThread = async ({
  thread,
  accountIds,
  firstMessage,
  imageDataUri,
  adminApiParams,
  queryClient,
}: CreateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Thread>>(
    `/threads`,
    {
      thread,
      accountIds,
      firstMessage,
      imageDataUri,
    }
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
