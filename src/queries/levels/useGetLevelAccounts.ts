import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { LEVEL_QUERY_KEY } from "./useGetLevel";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of accounts associated with a specific level.
 * This function is designed to fetch account details for a given level, which can be used in applications
 * that require information about accounts linked to different levels within an organization.
 * @name GetLevelAccounts
 * @param {string} levelId - The id of the level
 * @version 1.2
 **/

export const LEVEL_ACCOUNTS_QUERY_KEY = (levelId: string) => [
  ...LEVEL_QUERY_KEY(levelId),
  "ACCOUNTS",
];

export const SET_LEVEL_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVEL_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelAccounts>>
) => {
  client.setQueryData(LEVEL_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetLevelAccountsProps extends InfiniteQueryParams {
  levelId: string;
}

export const GetLevelAccounts = async ({
  levelId,
  pageParam,
  pageSize,
  search,
  adminApiParams,
}: GetLevelAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels/${levelId}/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetLevelAccounts = (
  levelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetLevelAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLevelAccounts>>
  >(
    LEVEL_ACCOUNTS_QUERY_KEY(levelId),
    (params: InfiniteQueryParams) =>
      GetLevelAccounts({
        ...params,
        levelId,
      }),
    params,
    {
      ...options,
      enabled: !!levelId && (options.enabled ?? true),
    },
    "sponsors"
  );
};