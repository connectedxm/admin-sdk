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
 * Endpoint to retrieve a list of tiers with an option to filter by type.
 * This function allows users to fetch tiers, which can be categorized as either "external" or "internal".
 * It is designed to be used in applications where tier information is required, with optional filtering capabilities.
 * @name GetTiers
 * @param {string} [type] - The type of tiers to retrieve, can be "external" or "internal"
 * @version 1.2
 **/

export const TIERS_QUERY_KEY = (type?: "external" | "internal") => {
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
  type?: "external" | "internal";
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