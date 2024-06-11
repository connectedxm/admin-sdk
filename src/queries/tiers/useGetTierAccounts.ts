import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { TIER_QUERY_KEY } from "./useGetTier";
import { GetAdminAPI } from "@src/AdminAPI";

// export const QUERY_KEY = "ACCOUNT_TIER_ACCOUNTS";
/**
 * @category Keys
 * @group Tiers
 */
export const TIER_ACCOUNTS_QUERY_KEY = (tierId: string) => [
  ...TIER_QUERY_KEY(tierId),
  "ACCOUNTS",
];

/**
 * @category Setters
 * @group Tiers
 */
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

/**
 * @category Queries
 * @group Tiers
 */
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
/**
 * @category Hooks
 * @group Tiers
 */
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
    }
  );
};
