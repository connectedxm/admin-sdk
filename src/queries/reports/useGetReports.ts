import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Report, ReportType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Reports
 */
export const REPORTS_QUERY_KEY = (
  type: keyof typeof ReportType,
  eventId?: string
) => {
  const keys = ["REPORTS", type];
  if (eventId) keys.push(eventId);
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
  eventId?: string;
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
  eventId,
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
      eventId,
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
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetReports>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetReports>>>(
    REPORTS_QUERY_KEY(type, eventId),
    (params: InfiniteQueryParams) => GetReports({ ...params, type, eventId }),
    params,
    {
      ...options,
      enabled: type === "event" ? !!eventId : true && (options.enabled ?? true),
    },
    "reports"
  );
};
