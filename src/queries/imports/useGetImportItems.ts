import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ImportItem } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { IMPORTS_QUERY_KEY } from "./useGetImports";

/**
 * Endpoint to retrieve a list of import items associated with a specific import ID.
 * This function is designed to fetch import items, which are part of a larger import process, 
 * allowing users to manage and review the items being imported.
 * @name GetImportItems
 * @param {string} importId (path) - The id of the import
 * @version 1.3
 **/
export const IMPORT_ITEMS_QUERY_KEY = (importId: string) => [
  ...IMPORTS_QUERY_KEY(),
  importId,
];

interface GetImportItemsProps extends InfiniteQueryParams {
  importId: string;
}

export const GetImportItems = async ({
  importId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetImportItemsProps): Promise<ConnectedXMResponse<ImportItem[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/imports/${importId}/items`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetImportItems = (
  importId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetImportItems>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetImportItems>>>(
    IMPORT_ITEMS_QUERY_KEY(importId),
    (params: InfiniteQueryParams) => GetImportItems({ ...params, importId }),
    params,
    {
      ...options,
      enabled: !!importId,
    },
    "org"
  );
};