import { ConnectedXMResponse } from "@src/interfaces";
import { Import } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { TIER_QUERY_KEY } from "./useGetTier";

/**
 * @category Keys
 * @group Imports
 */
export const TIER_IMPORTS_QUERY_KEY = (tierId: string) => {
  const keys = [...TIER_QUERY_KEY(tierId), "IMPORTS"];
  return keys;
};

interface GetTierImportsProps extends InfiniteQueryParams {
  tierId: string;
}

/**
 * @category Queries
 * @group Imports
 */
export const GetTierImports = async ({
  tierId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTierImportsProps): Promise<ConnectedXMResponse<Import[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}/imports`, {
    params: {
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
 * @group Imports
 */
export const useGetTierImports = (
  tierId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetTierImports>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTierImports>>>(
    TIER_IMPORTS_QUERY_KEY(tierId),
    (params: InfiniteQueryParams) => GetTierImports({ tierId, ...params }),
    params,
    {
      ...options,
      enabled: !!tierId && (options.enabled ?? true),
    }
  );
};
