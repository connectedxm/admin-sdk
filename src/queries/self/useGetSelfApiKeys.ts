// useGetSelfApiKeys.ts

import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, UserApiKey } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SELF_QUERY_KEY } from "./useGetSelf";

/**
 * @category Keys
 * @group SelfApiKeys
 */
export const SELF_API_KEYS_QUERY_KEY = () => [...SELF_QUERY_KEY(), "API_KEYS"];

/**
 * @category Setters
 * @group SelfApiKeys
 */
export const SET_SELF_API_KEYS_QUERY_DATA = (
  client: QueryClient,
  response: Awaited<ReturnType<typeof GetSelfApiKeys>>
) => {
  client.setQueryData(SELF_API_KEYS_QUERY_KEY(), response);
};

interface GetSelfApiKeysProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group SelfApiKeys
 */
export const GetSelfApiKeys = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSelfApiKeysProps): Promise<ConnectedXMResponse<UserApiKey[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/api-keys`, {
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
 * @group SelfApiKeys
 */
export const useGetSelfApiKeys = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfApiKeys>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfApiKeys>>>(
    SELF_API_KEYS_QUERY_KEY(),
    (queryParams: InfiniteQueryParams) => GetSelfApiKeys(queryParams),
    params,
    options
  );
};
