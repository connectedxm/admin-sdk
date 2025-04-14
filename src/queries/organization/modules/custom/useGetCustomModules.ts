import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { CustomModule } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const CUSTOM_MODULES_QUERY_KEY = () => ["CUSTOM_MODULES"];

/**
 * @category Setters
 * @group Organization
 */
export const SET_CUSTOM_MODULES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_MODULES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomModules>>
) => {
  client.setQueryData(CUSTOM_MODULES_QUERY_KEY(...keyParams), response);
};

interface GetCustomModulesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetCustomModules = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetCustomModulesProps): Promise<ConnectedXMResponse<CustomModule[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/modules/custom`, {
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
 * @group Organization
 */
export const useGetCustomModules = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCustomModules>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCustomModules>>
  >(
    CUSTOM_MODULES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetCustomModules(params),
    params,
    options,
    "org"
  );
};
