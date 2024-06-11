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
 * @category Keys
 * @group Imports
 */
export const IMPORT_ITEMS_QUERY_KEY = (importId: string) => [
  ...IMPORTS_QUERY_KEY(),
  importId,
];

interface GetImportItemsProps extends InfiniteQueryParams {
  importId: string;
}

/**
 * @category Queries
 * @group Imports
 */
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
/**
 * @category Hooks
 * @group Imports
 */
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
    }
  );
};
