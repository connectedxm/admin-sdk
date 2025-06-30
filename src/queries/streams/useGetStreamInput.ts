import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput } from "@src/interfaces";
import { STREAM_INPUTS_QUERY_KEY } from "./useGetStreamInputs";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_QUERY_KEY = (streamId: string) => [
  ...STREAM_INPUTS_QUERY_KEY(),
  streamId,
];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_INPUT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInput>>
) => {
  client.setQueryData(STREAM_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputParams extends SingleQueryParams {
  streamId: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamInput = async ({
  streamId,
  adminApiParams,
}: GetStreamInputParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}`);

  return data;
};
/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamInput = (
  streamId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetStreamInput>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStreamInput>>(
    STREAM_QUERY_KEY(streamId),
    (params) => GetStreamInput({ streamId, ...params }),
    {
      ...options,
      enabled: !!streamId && (options?.enabled ?? true),
    },
    "streams"
  );
};
