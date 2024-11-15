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
 * @category Params
 * @group Stream
 */
export interface CreateStreamInputOutputParams extends MutationParams {
  streamId: string;
  output: StreamInputOutputCreateInputs;
}

/**
 * @category Methods
 * @group Stream
 */
export const CreateStreamInputOutput = async ({
  streamId,
  output,
  adminApiParams,
  queryClient,
}: CreateStreamInputOutputParams): Promise<
  ConnectedXMResponse<StreamInputOutput>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<StreamInputOutput>
  >(`/streams/${streamId}/outputs`, output);
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

/**
 * @category Mutations
 * @group Stream
 */
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
