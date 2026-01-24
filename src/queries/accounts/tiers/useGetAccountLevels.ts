import { ConnectedXMResponse, Level } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "../useGetAccount";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_LEVELS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "LEVELS",
];

/**
 * @category Setters
 * @group Accounts
 */
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

/**
 * @category Queries
 * @group Accounts
 */
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

/**
 * @category Hooks
 * @group Accounts
 */
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
    }
  );
};
