import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { ImportItem } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { TIER_IMPORT_QUERY_KEY } from "./useGetTierImport";

/**
 * @category Keys
 * @group Imports
 */
export const TIER_IMPORT_ITEMS_QUERY_KEY = (
  tierId: string,
  importId: string
) => [...TIER_IMPORT_QUERY_KEY(tierId, importId), "ITEMS"];

interface GetTierImportItemsProps extends InfiniteQueryParams {
  tierId: string;
  importId: string;
}

/**
 * @category Queries
 * @group Imports
 */
export const GetTierImportItems = async ({
  tierId,
  importId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTierImportItemsProps): Promise<ConnectedXMResponse<ImportItem[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/tiers/${tierId}/imports/${importId}/items`,
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
 * @group Imports
 */
export const useGetTierImportItems = (
  tierId: string = "",
  importId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetTierImportItems>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetTierImportItems>>
  >(
    TIER_IMPORT_ITEMS_QUERY_KEY(tierId, importId),
    (params: InfiniteQueryParams) =>
      GetTierImportItems({ ...params, tierId, importId }),
    params,
    {
      ...options,
      enabled: !!importId && !!tierId && (options.enabled ?? true),
    }
  );
};
