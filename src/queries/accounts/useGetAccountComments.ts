import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of comments associated with a specific account, 
 * supporting pagination and filtering options. This function is designed to 
 * facilitate the fetching of account comments, allowing for efficient data 
 * retrieval in applications that require comment management or display.
 * @name GetAccountComments
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export const ACCOUNT_COMMENTS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "COMMENTS",
];

export const SET_ACCOUNT_COMMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_COMMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountComments>>
) => {
  client.setQueryData(ACCOUNT_COMMENTS_QUERY_KEY(...keyParams), response);
};

interface GetAccountCommentsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountComments = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountCommentsProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/comments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountComments = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountComments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountComments>>
  >(
    ACCOUNT_COMMENTS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountComments({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};