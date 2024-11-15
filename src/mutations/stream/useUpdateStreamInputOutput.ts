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
 * @category Params
 * @group Stream
 */
export interface UpdateStreamInputOutputParams extends MutationParams {
  streamId: string;
  outputId: string;
  output: StreamInputOutputUpdateInputs;
}

/**
 * @category Methods
 * @group Stream
 */
export const UpdateStreamInputOutput = async ({
  streamId,
  outputId,
  output,
  adminApiParams,
  queryClient,
}: UpdateStreamInputOutputParams): Promise<
  ConnectedXMResponse<StreamInputOutput>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<StreamInputOutput>
  >(`/streams/${streamId}/outputs/${outputId}`, {
    ...output,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_OUTPUT_QUERY_DATA(queryClient, [streamId, outputId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
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
