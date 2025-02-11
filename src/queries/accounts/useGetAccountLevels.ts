import { ConnectedXMResponse, Level } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a list of levels associated with a specific account.
 * This function is designed to fetch account levels using infinite query pagination, allowing for efficient data retrieval and management.
 * It is suitable for applications that require detailed information about account levels.
 * @name GetAccountLevels
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export const ACCOUNT_LEVELS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "LEVELS",
];

export const SET_ACCOUNT_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountLevels>>
) => {
  client.setQueryData(ACCOUNT_LEVELS_QUERY_KEY(...keyParams), response);
};

interface GetAccountLevelsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountLevels = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountLevelsProps): Promise<ConnectedXMResponse<Level[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Level[]>>(
    `/accounts/${accountId}/levels`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  return data;
};

export const useGetAccountLevels = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountLevels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountLevels>>
  >(
    ACCOUNT_LEVELS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountLevels({
        ...params,
        accountId,
      }),
    params,
    {
      ...options,
      enabled: !!accountId && (options.enabled ?? true),
    },
    "accounts"
  );
};
