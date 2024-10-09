import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { TIER_QUERY_KEY } from "./useGetTier";

// export const QUERY_KEY = "SUBSCRIBER_TIER_ACCOUNTS";
/**
 * @category Keys
 * @group Tiers
 */
export const TIER_SUBSCRIBERS_QUERY_KEY = (tierId: string) => [
  ...TIER_QUERY_KEY(tierId),
  "SUBSCRIBERS",
];

/**
 * @category Setters
 * @group Tiers
 */
export const SET_TIER_SUBSCRIBERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof TIER_SUBSCRIBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTierSubscribers>>
) => {
  client.setQueryData(TIER_SUBSCRIBERS_QUERY_KEY(...keyParams), response);
};

interface GetTierSubscribersProps extends InfiniteQueryParams {
  tierId?: string;
}

/**
 * @category Queries
 * @group Tiers
 */
export const GetTierSubscribers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  tierId,
  adminApiParams,
}: GetTierSubscribersProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}/subscribers`, {
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
export const useGetTierSubscribers = (
  tierId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetTierSubscribers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetTierSubscribers>>
  >(
    TIER_SUBSCRIBERS_QUERY_KEY(tierId),
    (params: InfiniteQueryParams) => GetTierSubscribers({ ...params, tierId }),
    params,
    {
      ...options,
      enabled: !!tierId && (options.enabled ?? true),
    },
    "accounts"
  );
};
