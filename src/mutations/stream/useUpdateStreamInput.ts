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
  EVENT_QUERY_KEY,
} from "@src/queries";
import { StreamInputUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Stream
 */
export interface UpdateStreamParams extends MutationParams {
  streamId: string;
  stream: StreamInputUpdateInputs;
}

/**
 * @category Methods
 * @group Stream
 */
export const UpdateStream = async ({
  streamId,
  stream,
  adminApiParams,
  queryClient,
}: UpdateStreamParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<StreamInput>>(
    `/streams/${streamId}`,
    {
      ...stream,
      id: undefined,
      event: undefined,
      session: undefined,
      connected: undefined,
      cloudflareId: undefined,
      createdAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: STREAM_INPUTS_QUERY_KEY() });

    if (stream.eventId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_QUERY_KEY(stream.eventId),
      });
    }

    SET_STREAM_INPUT_QUERY_DATA(
      queryClient,
      [streamId || data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
export const useUpdateStreamInput = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateStream>>,
      Omit<UpdateStreamParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateStreamParams,
    Awaited<ReturnType<typeof UpdateStream>>
  >(UpdateStream, options, {
    domain: "events",
    type: "update",
  });
};
