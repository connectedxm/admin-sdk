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
export interface DeleteStreamInputParams extends MutationParams {
  streamId: string;
}

/**
 * @category Methods
 * @group Stream
 */
export const DeleteStreamInput = async ({
  streamId,
  adminApiParams,
  queryClient,
}: DeleteStreamInputParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/streams/${streamId}`
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
