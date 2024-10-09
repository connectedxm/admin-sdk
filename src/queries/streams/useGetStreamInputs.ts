import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_INPUTS_QUERY_KEY = () => ["STREAMS"];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_INPUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputs>>
) => {
  client.setQueryData(STREAM_INPUTS_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputsParams extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamInputs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetStreamInputsParams): Promise<ConnectedXMResponse<StreamInput[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams`, {
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
export const useGetStreamInputs = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamInputs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetStreamInputs>>>(
    STREAM_INPUTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetStreamInputs(params),
    params,
    options,
    "streams"
  );
};
