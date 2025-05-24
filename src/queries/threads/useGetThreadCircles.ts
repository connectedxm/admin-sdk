import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ThreadCircle } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Threads
 */
export const THREAD_CIRCLES_QUERY_KEY = () => ["THREAD_CIRCLES"];

/**
 * @category Setters
 * @group Threads
 */
export const SET_THREAD_CIRCLES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircles>>
) => {
  client.setQueryData(THREAD_CIRCLES_QUERY_KEY(...keyParams), response);
};

interface GetThreadCirclesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Threads
 */
export const GetThreadCircles = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadCirclesProps): Promise<ConnectedXMResponse<ThreadCircle[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/circles`, {
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
 * @group Threads
 */
export const useGetThreadCircles = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadCircles>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadCircles>>
  >(
    THREAD_CIRCLES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetThreadCircles(params),
    params,
    options,
    "threads"
  );
};
