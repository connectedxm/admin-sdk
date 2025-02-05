import { ConnectedXMResponse } from "@src/interfaces";
import { Interest } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of interests.
 * This function fetches a paginated list of interests from the server, allowing for optional sorting and searching.
 * It is designed to be used in applications where a comprehensive list of interests is required.
 * @name GetInterests
 * @version 1.2
**/

export const INTERESTS_QUERY_KEY = () => ["INTERESTS"];

export const SET_INTERESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterests>>
) => {
  client.setQueryData(INTERESTS_QUERY_KEY(...keyParams), response);
};

interface GetInterestsProps extends InfiniteQueryParams {}

export const GetInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetInterests = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetInterests>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInterests>>>(
    INTERESTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetInterests(params),
    params,
    options,
    "interests"
  );
};