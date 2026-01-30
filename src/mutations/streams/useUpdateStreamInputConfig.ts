import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, StreamInput } from "@src/interfaces";
import {
  STREAM_INPUTS_QUERY_KEY,
  SET_STREAM_INPUT_QUERY_DATA,
} from "@src/queries";
import { StreamInputUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Stream
 */
export interface UpdateStreamInputConfigParams extends MutationParams {
  streamId: string;
  details: StreamInputUpdateInputs;
}

/**
 * @category Methods
 * @group Stream
 */
export const UpdateStreamInputConfig = async ({
  streamId,
  details,
  adminApiParams,
  queryClient,
}: UpdateStreamInputConfigParams): Promise<
  ConnectedXMResponse<StreamInput>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<StreamInput>>(
    `/streams/${streamId}/config`,
    details
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_QUERY_DATA(queryClient, [streamId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
export const useUpdateStreamInputConfig = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateStreamInputConfig>>,
      Omit<UpdateStreamInputConfigParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateStreamInputConfigParams,
    Awaited<ReturnType<typeof UpdateStreamInputConfig>>
  >(UpdateStreamInputConfig, options);
};
