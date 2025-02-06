import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, StreamInput } from "@src/interfaces";
import {
  STREAM_INPUTS_QUERY_KEY,
  SET_STREAM_INPUT_QUERY_DATA,
} from "@src/queries";
import { StreamInputUpdateInputs } from "@src/params";

/**
 * Endpoint to update the configuration of a specific stream.
 * This function allows users to modify the settings of a stream by providing the stream ID and the new configuration details.
 * It is designed for applications that require dynamic updates to stream configurations.
 * @name UpdateStreamConfig
 * @param {string} streamId (path) - The ID of the stream
 * @param {StreamInputUpdateInputs} details (body) - The details for updating the stream configuration
 * @version 1.3
 **/

export interface UpdateStreamConfigParams extends MutationParams {
  streamId: string;
  details: StreamInputUpdateInputs;
}

export const UpdateStreamConfig = async ({
  streamId,
  details,
  adminApiParams,
  queryClient,
}: UpdateStreamConfigParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<StreamInput>>(
    `/streams/${streamId}/config`,
    details
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_QUERY_DATA(queryClient, [streamId], data);
  }
  return data;
};

export const useUpdateStreamConfig = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateStreamConfig>>,
      Omit<UpdateStreamConfigParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateStreamConfigParams,
    Awaited<ReturnType<typeof UpdateStreamConfig>>
  >(UpdateStreamConfig, options, {
    domain: "events",
    type: "update",
  });
};