import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInputOutput } from "@src/interfaces";
import { STREAM_INPUT_OUTPUTS_QUERY_KEY } from "./useGetStreamInputOutputs";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_INPUT_OUTPUT_QUERY_KEY = (
  streamId: string,
  output: string
) => [...STREAM_INPUT_OUTPUTS_QUERY_KEY(streamId), output];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_INPUT_OUTPUT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUT_OUTPUT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputOutput>>
) => {
  client.setQueryData(STREAM_INPUT_OUTPUT_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputOutputParams extends SingleQueryParams {
  streamId: string;
  output: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamInputOutput = async ({
  streamId,
  output,
  adminApiParams,
}: GetStreamInputOutputParams): Promise<
  ConnectedXMResponse<StreamInputOutput>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/outputs/${output}`);

  return data;
};
/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamInputOutput = (
  streamId: string = "",
  output: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetStreamInputOutput>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStreamInputOutput>>(
    STREAM_INPUT_OUTPUT_QUERY_KEY(streamId, output),
    (params: SingleQueryParams) =>
      GetStreamInputOutput({ streamId, output, ...params }),
    {
      ...options,
      enabled: !!streamId && (options?.enabled ?? true),
    },
    "events"
  );
};
