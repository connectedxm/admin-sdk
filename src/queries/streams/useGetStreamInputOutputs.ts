import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInputOutput } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { STREAM_QUERY_KEY } from "./useGetStreamInput";

/**
 * Endpoint to fetch the input and output data for a specified stream.
 * This function retrieves a list of input and output records associated with a given stream ID.
 * It is designed to be used in applications that require detailed information about stream data transactions.
 * @name GetStreamInputOutputs
 * @param {string} streamId (path) The id of the stream
 * @version 1.3
 **/

export const STREAM_INPUT_OUTPUTS_QUERY_KEY = (streamId: string) => [
  ...STREAM_QUERY_KEY(streamId),
  "OUTPUTS",
];

export const SET_STREAM_INPUT_OUTPUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUT_OUTPUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputOutputs>>
) => {
  client.setQueryData(STREAM_INPUT_OUTPUTS_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputOutputsParams extends InfiniteQueryParams {
  streamId: string;
}

export const GetStreamInputOutputs = async ({
  streamId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetStreamInputOutputsParams): Promise<
  ConnectedXMResponse<StreamInputOutput[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/outputs`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetStreamInputOutputs = (
  streamId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamInputOutputs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetStreamInputOutputs>>
  >(
    STREAM_INPUT_OUTPUTS_QUERY_KEY(streamId),
    (params: InfiniteQueryParams) =>
      GetStreamInputOutputs({ ...params, streamId }),
    params,
    {
      ...options,
      enabled: !!streamId && (options.enabled ?? true),
    },
    "events"
  );
};