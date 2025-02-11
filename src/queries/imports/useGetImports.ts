import { ConnectedXMResponse } from "@src/interfaces";
import { Import } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a list of imports, optionally filtered by a specific tier ID.
 * This function is designed to fetch import data, which can be filtered by tier,
 * and is suitable for applications that require paginated import data retrieval.
 * @name GetImports
 * @param {string} [tierId] (query) The id of the tier to filter imports
 * @version 1.3
 **/

export const IMPORTS_QUERY_KEY = (tierId?: string) => {
  const keys = ["IMPORTS"];
  if (tierId) keys.push(tierId);
  return keys;
};

interface GetImportsProps extends InfiniteQueryParams {
  tierId?: string;
}

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
    options,
    "org"
  );
};
