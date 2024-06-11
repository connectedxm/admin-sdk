import { ConnectedXMResponse } from "@src/interfaces";

import { Import } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";

export const IMPORTS_QUERY_KEY = () => ["IMPORTS"];

interface GetImportsProps extends InfiniteQueryParams {}

export const GetImports = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetImportsProps): Promise<ConnectedXMResponse<Import[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/imports`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
export const useGetImports = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetImports>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetImports>>>(
    IMPORTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetImports({ ...params }),
    params,
    options
  );
};
