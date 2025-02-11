import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { StreamInputOutput, ConnectedXMResponse } from "@src/interfaces";
import {
  STREAM_INPUTS_QUERY_KEY,
  SET_STREAM_INPUT_OUTPUT_QUERY_DATA,
} from "@src/queries";
import { StreamInputOutputUpdateInputs } from "@src/params";

/**
 * Endpoint to update a specific stream input output by its identifiers.
 * This function allows updating the output data of a stream input within a system.
 * It is designed to be used in applications where modifications to stream outputs are required.
 * @name UpdateStreamInputOutput
 * @param {string} streamId (path) The ID of the stream
 * @param {string} outputId (path) The ID of the output
 * @param {StreamInputOutputUpdateInputs} output (body) The output data to update
 * @version 1.3
 **/
export interface UpdateStreamInputOutputParams extends MutationParams {
  streamId: string;
  outputId: string;
  output: StreamInputOutputUpdateInputs;
}

export const UpdateStreamInputOutput = async ({
  streamId,
  outputId,
  output,
  adminApiParams,
  queryClient,
}: UpdateStreamInputOutputParams): Promise<
  ConnectedXMResponse<StreamInputOutput>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<StreamInputOutput>>(
    `/streams/${streamId}/outputs/${outputId}`,
    {
      ...output,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_OUTPUT_QUERY_DATA(queryClient, [streamId, outputId], data);
  }
  return data;
};

export const useUpdateStreamInputOutput = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateStreamInputOutput>>,
      Omit<UpdateStreamInputOutputParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateStreamInputOutputParams,
    Awaited<ReturnType<typeof UpdateStreamInputOutput>>
  >(UpdateStreamInputOutput, options, {
    domain: "events",
    type: "update",
  });
};
