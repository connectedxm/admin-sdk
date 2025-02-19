import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Report, ReportType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
interface ReportFilters {
  eventId?: string;
  placeId?: string;
  groupId?: string;
}

/**
 * @category Keys
 * @group Reports
 */
export const REPORTS_QUERY_KEY = (
  type: keyof typeof ReportType,
  filters?: ReportFilters
) => {
  const keys = ["REPORTS", type];
  if (filters?.eventId) keys.push(filters.eventId);
  if (filters?.placeId) keys.push(filters.placeId);
  if (filters?.groupId) keys.push(filters.groupId);
  return keys;
};

/**
 * @category Setters
 * @group Reports
 */
export const SET_REPORTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReports>>
) => {
  client.setQueryData(REPORTS_QUERY_KEY(...keyParams), response);
};

interface GetReportsProps extends InfiniteQueryParams {
  type: keyof typeof ReportType;
  filters?: ReportFilters;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetReports = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  filters,
  adminApiParams,
}: GetReportsProps): Promise<ConnectedXMResponse<Report[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type,
      eventId: filters?.eventId,
      placeId: filters?.placeId,
      groupId: filters?.groupId,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Reports
 */
export const useGetReports = (
  type: keyof typeof ReportType,
  filters?: ReportFilters,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetReports>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetReports>>>(
    REPORTS_QUERY_KEY(type, filters),
    (params: InfiniteQueryParams) => GetReports({ ...params, type, filters }),
    params,
    {
      ...options,
      enabled:
        (type === "organization" ||
          (type === "event" && !!filters?.eventId) ||
          (type === "booking" && !!filters?.placeId) ||
          (type === "group" && !!filters?.groupId)) &&
        (options.enabled ?? true),
    },
    "reports"
  );
};
