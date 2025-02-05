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
 * Endpoint to retrieve a specific tier by its unique identifier.
 * This function allows users to fetch details of a tier using the provided tier ID.
 * It is designed to be used in applications where detailed information about a specific tier is required.
 * @name GetTier
 * @param {string} tierId - The ID of the tier to retrieve
 * @version 1.2
 **/

export const TIER_QUERY_KEY = (tierId: string) => [
  ...TIERS_QUERY_KEY(),
  tierId,
];

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

export const GetTier = async ({
  tierId,
  adminApiParams,
}: GetTierProps): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}`);
  return data;
};

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