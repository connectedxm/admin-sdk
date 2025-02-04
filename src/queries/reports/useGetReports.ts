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
 * Endpoint to retrieve a list of reports based on specified criteria.
 * This function allows users to fetch reports filtered by type and optionally by event ID.
 * It is designed to be used in applications where report data is required for analysis or display.
 * @name GetReports
 * @param {ReportType} type - The type of the report
 * @param {string} [eventId] - The ID of the event
 * @version 1.2
 **/

export const REPORTS_QUERY_KEY = (
  type: keyof typeof ReportType,
  eventId?: string
) => {
  const keys = ["REPORTS", type];
  if (eventId) keys.push(eventId);
  return keys;
};

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