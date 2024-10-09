import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";

import { Tier } from "@src/interfaces";
import { TIERS_QUERY_KEY } from "./useGetTiers";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Tiers
 */
export const TIER_QUERY_KEY = (tierId: string) => [
  ...TIERS_QUERY_KEY(),
  tierId,
];

/**
 * @category Setters
 * @group Tiers
 */
export const SET_TIER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TIER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTier>>
) => {
  client.setQueryData(TIER_QUERY_KEY(...keyParams), response);
};

interface GetTierProps extends SingleQueryParams {
  tierId: string;
}

/**
 * @category Queries
 * @group Tiers
 */
export const GetTier = async ({
  tierId,
  adminApiParams,
}: GetTierProps): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}`);
  return data;
};
/**
 * @category Hooks
 * @group Tiers
 */
export const useGetTier = (
  tierId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetTier>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetTier>>(
    TIER_QUERY_KEY(tierId),
    (params: SingleQueryParams) => GetTier({ tierId, ...params }),
    {
      ...options,
      enabled: !!tierId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
