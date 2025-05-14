import { ConnectedXMResponse } from "@src/interfaces";
import { MembershipPrice } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { MEMBERSHIP_QUERY_KEY } from "./useGetMembership";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Subscriptions
 */
export const MEMBERSHIP_PRICES_QUERY_KEY = (membershipId: string) => [
  ...MEMBERSHIP_QUERY_KEY(membershipId),
  "MEMBERSHIP_PRICES",
];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_MEMBERSHIP_PRICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEMBERSHIP_PRICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMembershipPrices>>
) => {
  client.setQueryData(MEMBERSHIP_PRICES_QUERY_KEY(...keyParams), response);
};

interface GetMembershipPricesProps extends InfiniteQueryParams {
  membershipId: string;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetMembershipPrices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  membershipId,
  adminApiParams,
}: GetMembershipPricesProps): Promise<
  ConnectedXMResponse<MembershipPrice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${membershipId}/prices`,
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
export const useGetMembershipPrices = (
  membershipId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMembershipPrices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMembershipPrices>>
  >(
    MEMBERSHIP_PRICES_QUERY_KEY(membershipId),
    (params: InfiniteQueryParams) =>
      GetMembershipPrices({ ...params, membershipId }),
    params,
    {
      ...options,
      enabled: !!membershipId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};
