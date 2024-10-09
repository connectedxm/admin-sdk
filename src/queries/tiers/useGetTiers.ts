import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Tier } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Tiers
 */
export const TIERS_QUERY_KEY = (type?: "external" | "internal") => {
  const keys = ["TIERS"];
  if (type) keys.push(type);
  return keys;
};

/**
 * @category Setters
 * @group Tiers
 */
export const SET_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTiers>>
) => {
  client.setQueryData(TIERS_QUERY_KEY(...keyParams), response);
};

interface GetTiersProps extends InfiniteQueryParams {
  type?: "external" | "internal";
}

/**
 * @category Queries
 * @group Tiers
 */
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
/**
 * @category Hooks
 * @group Tiers
 */
export const useGetTiers = (
  type?: "external" | "internal",
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
