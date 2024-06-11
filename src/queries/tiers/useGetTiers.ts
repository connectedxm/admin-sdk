import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Tier } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

export const TIERS_QUERY_KEY = () => ["TIERS"];

export const SET_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTiers>>
) => {
  client.setQueryData(TIERS_QUERY_KEY(...keyParams), response);
};

interface GetTiersProps extends InfiniteQueryParams {}

export const GetTiers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
export const useGetTiers = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetTiers>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTiers>>>(
    TIERS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetTiers({ ...params }),
    params,
    options
  );
};
