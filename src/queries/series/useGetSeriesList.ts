import { ConnectedXMResponse } from "@src/interfaces";
import { Series } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_LIST_QUERY_KEY = () => {
  const keys = ["SERIES"];
  return keys;
};

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_LIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_LIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesList>>
) => {
  client.setQueryData(SERIES_LIST_QUERY_KEY(...keyParams), response);
};

interface GetSeriesListProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesList = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesListProps): Promise<ConnectedXMResponse<Series[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series`, {
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
 * @group Series
 */
export const useGetSeriesList = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSeriesList>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesList>>>(
    SERIES_LIST_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSeriesList({ ...params }),
    params,
    options
  );
};
