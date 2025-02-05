import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { TIER_QUERY_KEY } from "./useGetTier";

/**
 * Endpoint to retrieve a list of subscribers for a specific tier.
 * This function allows users to fetch subscribers associated with a particular tier within an organization.
 * It is designed to be used in applications where subscriber information for a tier is required.
 * @name GetTierSubscribers
 * @param {string} [tierId] - The id of the tier
 * @version 1.2
 **/

export const TIER_SUBSCRIBERS_QUERY_KEY = (tierId: string) => [
  ...TIER_QUERY_KEY(tierId),
  "SUBSCRIBERS",
];

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