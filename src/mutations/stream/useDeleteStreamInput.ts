import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { STREAM_INPUTS_QUERY_KEY, STREAM_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific stream input by its ID.
 * This function allows for the removal of a stream input from the system, ensuring that associated queries are invalidated and removed.
 * It is intended for use in scenarios where stream inputs need to be managed or cleaned up.
 * @name DeleteStreamInput
 * @param {string} streamId (path) - The ID of the stream input to be deleted
 * @version 1.3
 **/

export interface DeleteStreamInputParams extends MutationParams {
  streamId: string;
}

export const DeleteStreamInput = async ({
  streamId,
  adminApiParams,
  queryClient,
}: DeleteStreamInputParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/streams/${streamId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: STREAM_QUERY_KEY(streamId) });
  }
  return data;
};

export const useDeleteStreamInput = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteStreamInput>>,
      Omit<DeleteStreamInputParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteStreamInputParams,
    Awaited<ReturnType<typeof DeleteStreamInput>>
  >(DeleteStreamInput, options, {
    domain: "events",
    type: "del",
  });
};