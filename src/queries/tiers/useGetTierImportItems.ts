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
 * Endpoint to retrieve a list of import items for a specific tier and import.
 * This function fetches import items associated with a given tier and import ID, 
 * allowing users to access detailed information about each import item.
 * It is designed for applications that require a comprehensive list of import items 
 * for further processing or display.
 * @name GetTierImportItems
 * @param {string} tierId - The id of the tier
 * @param {string} importId - The id of the import
 * @version 1.2
 **/

export const TIER_IMPORT_ITEMS_QUERY_KEY = (
  tierId: string,
  importId: string
) => [...TIER_IMPORT_QUERY_KEY(tierId, importId), "ITEMS"];

interface GetTierImportItemsProps extends InfiniteQueryParams {
  tierId: string;
  importId: string;
}

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
    },
    "accounts"
  );
};