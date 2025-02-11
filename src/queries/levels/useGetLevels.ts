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
 * Endpoint to manage and fetch level data.
 * This function provides the ability to retrieve a list of levels with support for pagination and sorting.
 * It is designed to be used in applications where level data needs to be displayed or managed.
 * @name GetLevels
 * @version 1.3
**/

export const LEVELS_QUERY_KEY = () => ["LEVELS"];

export const SET_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevels>>
) => {
  client.setQueryData(LEVELS_QUERY_KEY(...keyParams), response);
};

interface GetLevelsProps extends InfiniteQueryParams {}

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
    options,
    "sponsors"
  );
};