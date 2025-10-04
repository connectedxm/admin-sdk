import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Membership } from "@src/interfaces";
import { MEMBERSHIPS_QUERY_KEY } from "./useGetMemberships";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Subscriptions
 */
export const MEMBERSHIP_QUERY_KEY = (membershipId: string) => [
  ...MEMBERSHIPS_QUERY_KEY(),
  membershipId,
];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_MEMBERSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEMBERSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMembership>>
) => {
  client.setQueryData(MEMBERSHIP_QUERY_KEY(...keyParams), response);
};

interface GetMembershipProps extends SingleQueryParams {
  membershipId: string;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetMembership = async ({
  membershipId,
  adminApiParams,
}: GetMembershipProps): Promise<ConnectedXMResponse<Membership>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/subscription-products/${membershipId}`);
  return data;
};

/**
 * @category Hooks
 * @group Subscriptions
 */
export const useGetMembership = (
  membershipId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMembership>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMembership>>(
    MEMBERSHIP_QUERY_KEY(membershipId),
    (params: SingleQueryParams) => GetMembership({ membershipId, ...params }),
    {
      ...options,
      enabled: !!membershipId && (options?.enabled ?? true),
    }
  );
};
