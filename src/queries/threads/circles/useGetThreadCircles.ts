import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ThreadCircleType } from "@src/interfaces";
import { ThreadCircle } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Threads
 */
export const THREAD_CIRCLES_QUERY_KEY = (
  type?: keyof typeof ThreadCircleType
) => {
  const key = ["CIRCLES"];
  if (type) key.push(type);
  return key;
};

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

interface GetThreadCirclesProps extends InfiniteQueryParams {
  type: keyof typeof ThreadCircleType;
}

/**
 * @category Queries
 * @group Threads
 */
export const GetThreadCircles = async ({
  type,
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
      type: type || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Threads
 */
export const useGetThreadCircles = (
  type: keyof typeof ThreadCircleType,
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
    THREAD_CIRCLES_QUERY_KEY(type),
    (params: InfiniteQueryParams) => GetThreadCircles({ type, ...params }),
    params,
    options
  );
};
