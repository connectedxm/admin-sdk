import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { ImportItem } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { IMPORTS_QUERY_KEY } from "./useGetImports";

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

const useGetImportItems = (importId: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetImportItems>>>(
    IMPORT_ITEMS_QUERY_KEY(importId),
    (params: any) => GetImportItems({ ...params }),
    {
      importId,
    },
    {
      enabled: !!importId,
    }
  );
};

export default useGetImportItems;
