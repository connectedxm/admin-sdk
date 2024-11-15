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
 * @category Keys
 * @group Streams
 */
export const STREAM_INPUT_OUTPUTS_QUERY_KEY = (streamId: string) => [
  ...STREAM_QUERY_KEY(streamId),
  "OUTPUTS",
];

/**
 * @category Setters
 * @group Streams
 */
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

/**
 * @category Queries
 * @group Streams
 */
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
/**
 * @category Hooks
 * @group Streams
 */
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
