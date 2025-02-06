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
 * Endpoint to retrieve a list of stream inputs.
 * This function fetches stream input data from the server, allowing for infinite scrolling and pagination.
 * It is designed to be used in applications where a comprehensive list of stream inputs is required.
 * @name GetStreamInputs
 * @version 1.3
 **/

export const STREAM_INPUTS_QUERY_KEY = () => ["STREAMS"];

export const SET_STREAM_INPUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputs>>
) => {
  client.setQueryData(STREAM_INPUTS_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputsParams extends InfiniteQueryParams {}

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
    "events"
  );
};