import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { STREAM_INPUTS_QUERY_KEY, STREAM_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific output from a stream.
 * This function allows the removal of an output associated with a given stream by specifying the stream and output IDs.
 * It is useful in scenarios where stream outputs need to be managed or cleaned up.
 * @name DeleteStreamInputOutput
 * @param {string} streamId (path) The id of the stream
 * @param {string} outputId (path) The id of the output
 * @version 1.3
 **/

export interface DeleteStreamInputOutputParams extends MutationParams {
  streamId: string;
  outputId: string;
}

export const DeleteStreamInputOutput = async ({
  streamId,
  outputId,
  adminApiParams,
  queryClient,
}: DeleteStreamInputOutputParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/streams/${streamId}/outputs/${outputId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: STREAM_QUERY_KEY(streamId) });
  }
  return data;
};

export const useDeleteStreamInputOutput = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteStreamInputOutput>>,
      Omit<DeleteStreamInputOutputParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteStreamInputOutputParams,
    Awaited<ReturnType<typeof DeleteStreamInputOutput>>
  >(DeleteStreamInputOutput, options, {
    domain: "events",
    type: "del",
  });
};
