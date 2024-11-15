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
 * @category Params
 * @group Stream
 */
export interface CreateStreamInputParams extends MutationParams {
  stream: StreamInputCreateInputs;
}

/**
 * @category Methods
 * @group Stream
 */
export const CreateStreamInput = async ({
  stream,
  adminApiParams,
  queryClient,
}: CreateStreamInputParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<StreamInput>>(
    `/streams`,
    stream
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });
    SET_STREAM_INPUT_QUERY_DATA(queryClient, [data?.data.id.toString()], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
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
