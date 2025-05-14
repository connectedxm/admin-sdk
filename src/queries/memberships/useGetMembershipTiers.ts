import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { MEMBERSHIP_QUERY_KEY } from "./useGetMembership";

/**
 * @category Keys
 * @group Subscriptions
 */
export const MEMBERSHIP_TIERS_QUERY_KEY = (membershipId: string) => [
  ...MEMBERSHIP_QUERY_KEY(membershipId),
  "MEMBERSHIP_TIERS",
];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_MEMBERSHIP_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEMBERSHIP_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMembershipTiers>>
) => {
  client.setQueryData(MEMBERSHIP_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetMembershipTiersProps extends InfiniteQueryParams {
  membershipId: string;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetMembershipTiers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  membershipId,
  adminApiParams,
}: GetMembershipTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${membershipId}/tiers`,
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
 * @group Subscriptions
 */
export const useGetMembershipTiers = (
  membershipId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMembershipTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMembershipTiers>>
  >(
    MEMBERSHIP_TIERS_QUERY_KEY(membershipId),
    (params: InfiniteQueryParams) =>
      GetMembershipTiers({ ...params, membershipId }),
    params,
    {
      ...options,
      enabled: !!membershipId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};
