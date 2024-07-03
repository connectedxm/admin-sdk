import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Level } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Levels
 */
export const LEVELS_QUERY_KEY = () => ["LEVELS"];

/**
 * @category Setters
 * @group Levels
 */
export const SET_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevels>>
) => {
  client.setQueryData(LEVELS_QUERY_KEY(...keyParams), response);
};

interface GetLevelsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Levels
 */
export const GetLevels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetLevelsProps): Promise<ConnectedXMResponse<Level[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels`, {
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
 * @group Levels
 */
export const useGetLevels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetLevels>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLevels>>>(
    LEVELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetLevels(params),
    params,
    options
  );
};
