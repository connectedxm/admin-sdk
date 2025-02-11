import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { TIER_QUERY_KEY } from "./useGetTier";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of accounts associated with a specific tier.
 * This function allows users to fetch accounts that belong to a particular tier, 
 * providing options for pagination, sorting, and searching.
 * It is designed to be used in applications where tier-based account management is required.
 * @name GetTierAccounts
 * @param {string} [tierId] (path) The id of the tier
 * @version 1.3
 */

export const TIER_ACCOUNTS_QUERY_KEY = (tierId: string) => [
  ...TIER_QUERY_KEY(tierId),
  "ACCOUNTS",
];

export const SET_TIER_ACCOUNTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof TIER_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTierAccounts>>
) => {
  client.setQueryData(TIER_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetTierAccountsProps extends InfiniteQueryParams {
  tierId?: string;
}

export const GetTierAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  tierId,
  adminApiParams,
}: GetTierAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      tierId: tierId || undefined,
    },
  });
  return data;
};

export const useGetTierAccounts = (
  tierId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetTierAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTierAccounts>>>(
    TIER_ACCOUNTS_QUERY_KEY(tierId),
    (params: InfiniteQueryParams) => GetTierAccounts({ ...params, tierId }),
    params,
    {
      ...options,
      enabled: !!tierId && (options.enabled ?? true),
    },
    "accounts"
  );
};