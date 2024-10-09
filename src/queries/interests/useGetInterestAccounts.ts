import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Interests
 */
export const INTEREST_ACCOUNTS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "ACCOUNTS",
];

/**
 * @category Setters
 * @group Interests
 */
export const SET_INTEREST_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestAccounts>>
) => {
  client.setQueryData(INTEREST_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetInterestAccountsProps extends InfiniteQueryParams {
  interestId: string;
}

/**
 * @category Queries
 * @group Interests
 */
export const GetInterestAccounts = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/accounts`, {
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
 * @group Interests
 */
export const useGetInterestAccounts = (
  interestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestAccounts>>
  >(
    INTEREST_ACCOUNTS_QUERY_KEY(interestId),
    (params: InfiniteQueryParams) =>
      GetInterestAccounts({
        interestId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!interestId && (options.enabled ?? true),
    },
    "interests"
  );
};
