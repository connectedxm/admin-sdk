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
 * Retrieves a list of API keys associated with the current user.
 * This function is designed to fetch all API keys that belong to the user, allowing them to manage or review their keys.
 * It supports pagination and sorting to efficiently handle large sets of API keys.
 * @name GetSelfApiKeys
 * @version 1.2
 **/

export const SELF_API_KEYS_QUERY_KEY = () => [...SELF_QUERY_KEY(), "API_KEYS"];

export const SET_SELF_API_KEYS_QUERY_DATA = (
  client: QueryClient,
  response: Awaited<ReturnType<typeof GetSelfApiKeys>>
) => {
  client.setQueryData(SELF_API_KEYS_QUERY_KEY(), response);
};

interface GetSelfApiKeysProps extends InfiniteQueryParams {}

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