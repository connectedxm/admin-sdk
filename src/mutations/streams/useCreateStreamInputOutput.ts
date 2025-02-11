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
import { StreamInputOutputCreateInputs } from "@src/params";

/**
 * Endpoint to create a new stream input-output configuration.
 * This function allows the creation of a new output configuration for a specified stream.
 * It is designed to be used in applications where stream output configurations need to be dynamically managed.
 * @name CreateStreamInputOutput
 * @param {string} streamId (path) The ID of the stream
 * @param {StreamInputOutputCreateInputs} output (body) The output configuration for the stream
 * @version 1.3
 **/

export interface CreateStreamInputOutputParams extends MutationParams {
  streamId: string;
  output: StreamInputOutputCreateInputs;
}

export const CreateStreamInputOutput = async ({
  streamId,
  output,
  adminApiParams,
  queryClient,
}: CreateStreamInputOutputParams): Promise<
  ConnectedXMResponse<StreamInputOutput>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<StreamInputOutput>>(
    `/streams/${streamId}/outputs`,
    output
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_OUTPUT_QUERY_DATA(
      queryClient,
      [streamId, data?.data?.uid],
      data
    );
  }
  return data;
};

export const useCreateStreamInputOutput = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateStreamInputOutput>>,
      Omit<CreateStreamInputOutputParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateStreamInputOutputParams,
    Awaited<ReturnType<typeof CreateStreamInputOutput>>
  >(CreateStreamInputOutput, options, {
    domain: "events",
    type: "create",
  });
};
