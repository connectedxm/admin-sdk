import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { TIER_QUERY_KEY } from "./useGetTier";

// export const QUERY_KEY = "ACCOUNT_TIER_ACCOUNTS";
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

const useGetTierAccounts = (tierId: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTierAccounts>>>(
    TIER_ACCOUNTS_QUERY_KEY(tierId),
    (params: any) => GetTierAccounts({ ...params, tierId }),
    {},
    {
      enabled: !!tierId,
    }
  );
};

export default useGetTierAccounts;
