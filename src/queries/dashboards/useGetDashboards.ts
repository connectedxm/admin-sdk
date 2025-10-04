import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, BaseDashboard } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Dashboards
 */
export const DASHBOARDS_QUERY_KEY = (eventId?: string) => {
  const keys = ["DASHBOARDS"];
  if (eventId) keys.push(eventId);
  return keys;
};

/**
 * @category Setters
 * @group Dashboards
 */
export const SET_DASHBOARDS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof DASHBOARDS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetDashboards>>
) => {
  client.setQueryData(DASHBOARDS_QUERY_KEY(...keyParams), response);
};

interface GetDashboardsProps extends InfiniteQueryParams {
  eventId?: string;
}

/**
 * @category Queries
 * @group Dashboards
 */
export const GetDashboards = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  adminApiParams,
}: GetDashboardsProps): Promise<ConnectedXMResponse<BaseDashboard[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/dashboards`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Dashboards
 */
export const useGetDashboards = (
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetDashboards>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetDashboards>>>(
    DASHBOARDS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetDashboards({ ...params, eventId }),
    params,
    options
  );
};
