import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Subscription, SubscriptionStatus } from "@src/interfaces";
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
export const MEMBERSHIP_SUBSCRIPTIONS_QUERY_KEY = (
  membershipId: string,
  status?: SubscriptionStatus
) => {
  const queryKey = [...MEMBERSHIP_QUERY_KEY(membershipId), membershipId];

  if (status) {
    queryKey.push(status);
  }

  return queryKey;
};

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_MEMBERSHIP_SUBSCRIPTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEMBERSHIP_SUBSCRIPTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMembershipSubscriptions>>
) => {
  client.setQueryData(
    MEMBERSHIP_SUBSCRIPTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMembershipSubscriptionsProps extends InfiniteQueryParams {
  membershipId: string;
  status?: SubscriptionStatus;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetMembershipSubscriptions = async ({
  membershipId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetMembershipSubscriptionsProps): Promise<
  ConnectedXMResponse<Subscription[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${membershipId}/subscriptions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Subscriptions
 */
export const useGetMembershipSubscriptions = (
  membershipId: string,
  status?: SubscriptionStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMembershipSubscriptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMembershipSubscriptions>>
  >(
    MEMBERSHIP_SUBSCRIPTIONS_QUERY_KEY(membershipId, status),
    (params: InfiniteQueryParams) =>
      GetMembershipSubscriptions({
        membershipId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!membershipId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};
