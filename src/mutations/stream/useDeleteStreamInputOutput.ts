import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { STREAM_INPUTS_QUERY_KEY, STREAM_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Stream
 */
export interface DeleteStreamInputOutputParams extends MutationParams {
  streamId: string;
  outputId: string;
}

/**
 * @category Methods
 * @group Stream
 */
export const DeleteStreamInputOutput = async ({
  streamId,
  outputId,
  adminApiParams,
  queryClient,
}: DeleteStreamInputOutputParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/streams/${streamId}/outputs/${outputId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: STREAM_QUERY_KEY(streamId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
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
  >(DeleteStreamInputOutput, options);
};
