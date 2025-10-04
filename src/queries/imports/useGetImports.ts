import { ConnectedXMResponse } from "@src/interfaces";
import { Import } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Imports
 */
export const IMPORTS_QUERY_KEY = (tierId?: string) => {
  const keys = ["IMPORTS"];
  if (tierId) keys.push(tierId);
  return keys;
};

interface GetImportsProps extends InfiniteQueryParams {
  tierId?: string;
}

/**
 * @category Queries
 * @group Imports
 */
export const GetImports = async ({
  tierId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetImportsProps): Promise<ConnectedXMResponse<Import[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/imports`, {
    params: {
      tierId: tierId || undefined,
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
export const useGetImports = (
  tierId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetImports>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetImports>>>(
    IMPORTS_QUERY_KEY(tierId),
    (params: InfiniteQueryParams) => GetImports({ tierId, ...params }),
    params,
    options
  );
};
