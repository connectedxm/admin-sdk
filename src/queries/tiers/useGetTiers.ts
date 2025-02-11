import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, TierType } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * This file contains functions for retrieving and managing tier information.
 * It provides an endpoint to fetch a list of tiers with optional filtering by type.
 * The functions in this file are designed to be used in applications where tier information is required.
 * @name GetTiers
 * @param {TierType} [type] (query) The type of tiers to retrieve
 * @version 1.3
 */

export const TIERS_QUERY_KEY = (type?: keyof typeof TierType) => {
  const keys = ["TIERS"];
  if (type) keys.push(type);
  return keys;
};

export const SET_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTiers>>
) => {
  client.setQueryData(TIERS_QUERY_KEY(...keyParams), response);
};

interface GetTiersProps extends InfiniteQueryParams {
  type?: keyof typeof TierType;
}

export const GetTiers = async ({
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Tier[]>>(`/tiers`, {
    params: {
      type: type || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetTiers = (
  type?: keyof typeof TierType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetTiers>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTiers>>>(
    TIERS_QUERY_KEY(type),
    (params: InfiniteQueryParams) => GetTiers({ type, ...params }),
    params,
    options,
    "accounts"
  );
};
