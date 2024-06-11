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
 * @category Keys
 * @group Levels
 */
export const LEVEL_ACCOUNTS_QUERY_KEY = (levelId: string) => [
  ...LEVEL_QUERY_KEY(levelId),
  "ACCOUNTS",
];

/**
 * @category Setters
 * @group Levels
 */
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

/**
 * @category Queries
 * @group Levels
 */
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
/**
 * @category Hooks
 * @group Levels
 */
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
    }
  );
};
