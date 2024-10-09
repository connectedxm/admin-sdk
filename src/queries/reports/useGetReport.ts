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
 * @category Keys
 * @group Reports
 */
export const REPORT_QUERY_KEY = (
  type: keyof typeof ReportType,
  reportId: string
) => [...REPORTS_QUERY_KEY(type), reportId];

/**
 * @category Setters
 * @group Reports
 */
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

/**
 * @category Queries
 * @group Reports
 */
export const GetReport = async ({
  reportId,
  eventId,
  adminApiParams,
}: GetReportProps): Promise<ConnectedXMResponse<Report>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/${reportId}`, {
    params: {
      eventId,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Reports
 */
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
      staleTime: Infinity,
    },
    "reports"
  );
};
