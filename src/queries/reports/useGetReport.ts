import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Report, ReportType } from "@src/interfaces";
import { REPORTS_QUERY_KEY } from "../reports/useGetReports";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches a specific report by its ID, including detailed data and handling pagination.
 * This function is designed to retrieve comprehensive report information, optionally filtered by an event ID.
 * It is suitable for applications that require detailed report data with support for pagination.
 * @name GetReport
 * @param {string} reportId - The ID of the report
 * @param {string} [eventId] - Optional event ID for filtering the report
 * @version 1.2
 **/

export const REPORT_QUERY_KEY = (
  type: keyof typeof ReportType,
  reportId: string
) => [...REPORTS_QUERY_KEY(type), reportId];

export const SET_REPORT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReport>>
) => {
  client.setQueryData(REPORT_QUERY_KEY(...keyParams), response);
};

interface GetReportProps extends SingleQueryParams {
  reportId: string;
  eventId?: string;
}

export const GetReport = async ({
  reportId,
  eventId,
  adminApiParams,
}: GetReportProps): Promise<ConnectedXMResponse<Report>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  let nextCursor: number | null = null;
  const rowData = [];

  const { data } = await adminApi.get<ConnectedXMResponse<Report>>(
    `/reports/${reportId}`,
    {
      params: {
        eventId,
      },
    }
  );

  rowData.push(...data.data.rowData);
  nextCursor = data.data.nextCursor;

  while (nextCursor) {
    const { data: nextData } = await adminApi.get<ConnectedXMResponse<Report>>(
      `/reports/${reportId}`,
      {
        params: {
          eventId,
          cursor: nextCursor,
        },
      }
    );

    rowData.push(...nextData.data.rowData);
    nextCursor = nextData.data.nextCursor;
  }

  return {
    ...data,
    data: {
      ...data.data,
      rowData,
    },
  };
};

export const useGetReport = (
  reportId: string = "",
  eventId?: string,
  options: SingleQueryOptions<ReturnType<typeof GetReport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReport>>(
    REPORT_QUERY_KEY(eventId ? "event" : "organization", reportId),
    (params: SingleQueryParams) => GetReport({ reportId, eventId, ...params }),
    {
      ...options,
      enabled: !!reportId && (options?.enabled ?? true),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    },
    "reports"
  );
};