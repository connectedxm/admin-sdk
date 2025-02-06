import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { StreamInput, ConnectedXMResponse } from "@src/interfaces";
import {
  STREAM_INPUTS_QUERY_KEY,
  SET_STREAM_INPUT_QUERY_DATA,
} from "@src/queries";
import { StreamInputCreateInputs } from "@src/params";

/**
 * Endpoint to create a new stream input within the system.
 * This function allows users to add a new stream input by providing the necessary stream input data.
 * It ensures that the stream input is created and updates the relevant query data if the operation is successful.
 * @name CreateStreamInput
 * @param {StreamInputCreateInputs} stream (body) The stream input data to be created
 * @version 1.3
 **/

export interface CreateStreamInputParams extends MutationParams {
  stream: StreamInputCreateInputs;
}

export const CreateStreamInput = async ({
  stream,
  adminApiParams,
  queryClient,
}: CreateStreamInputParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<StreamInput>>(
    `/streams`,
    stream
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_QUERY_DATA(queryClient, [data?.data.id.toString()], data);
  }
  return data;
};

export const useCreateStreamInput = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateStreamInput>>,
      Omit<CreateStreamInputParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateStreamInputParams,
    Awaited<ReturnType<typeof CreateStreamInput>>
  >(CreateStreamInput, options, {
    domain: "events",
    type: "create",
  });
};
