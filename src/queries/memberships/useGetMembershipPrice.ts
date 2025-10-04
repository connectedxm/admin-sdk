import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { MembershipPrice } from "@src/interfaces";
import { MEMBERSHIP_PRICES_QUERY_KEY } from "./useGetMembershipPrices";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Subscriptions
 */
export const MEMBERSHIP_PRICE_QUERY_KEY = (
  membershipId: string,
  membershipPriceId: string
) => [...MEMBERSHIP_PRICES_QUERY_KEY(membershipId), membershipPriceId];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_MEMBERSHIP_PRICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEMBERSHIP_PRICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMembershipPrice>>
) => {
  client.setQueryData(MEMBERSHIP_PRICE_QUERY_KEY(...keyParams), response);
};

interface GetMembershipPriceProps extends SingleQueryParams {
  membershipId: string;
  membershipPriceId: string;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetMembershipPrice = async ({
  membershipId,
  membershipPriceId,
  adminApiParams,
}: GetMembershipPriceProps): Promise<ConnectedXMResponse<MembershipPrice>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${membershipId}/prices/${membershipPriceId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Subscriptions
 */
export const useGetMembershipPrice = (
  membershipId: string = "",
  membershipPriceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMembershipPrice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMembershipPrice>>(
    MEMBERSHIP_PRICE_QUERY_KEY(membershipId, membershipPriceId),
    (params: SingleQueryParams) =>
      GetMembershipPrice({
        membershipId,
        membershipPriceId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!membershipId && !!membershipPriceId && (options?.enabled ?? true),
    }
  );
};
