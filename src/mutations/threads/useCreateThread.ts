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
 * Endpoint to create a new thread within the application.
 * This function allows users to initiate a new thread by providing necessary input data.
 * It supports optional parameters for account IDs, a first message, and an image data URI.
 * The function is designed to be used in scenarios where creating a new thread is required.
 * @name CreateThread
 * @param {ThreadCreateInputs} thread (bodyValue) - The thread input data
 * @param {string[]} [accountIds] (bodyValue) - Optional list of account IDs
 * @param {string} [firstMessage] (bodyValue) - Optional first message for the thread
 * @param {string} [imageDataUri] (bodyValue) - Optional image data URI
 * @version 1.3
 **/
export interface CreateThreadParams extends MutationParams {
  thread: ThreadCreateInputs;
  accountIds?: string[];
  firstMessage?: string;
  imageDataUri?: string;
}

export const CreateThread = async ({
  thread,
  accountIds,
  firstMessage,
  imageDataUri,
  adminApiParams,
  queryClient,
}: CreateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Thread>>(
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