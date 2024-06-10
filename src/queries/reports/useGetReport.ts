import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Report, ReportType } from "@src/interfaces";
import { REPORTS_QUERY_KEY } from "../reports/useGetReports";
import { QueryClient } from "@tanstack/react-query";

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

interface GetReportProps {
  reportId: string;
  eventId?: string;
}

export const GetReport = async ({
  reportId,
  eventId,
}: GetReportProps): Promise<ConnectedXMResponse<Report>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/${reportId}`, {
    params: {
      eventId,
    },
  });
  return data;
};

const useGetReport = (reportId: string, eventId?: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReport>>(
    REPORT_QUERY_KEY(eventId ? "event" : "organization", reportId),
    () => GetReport({ reportId, eventId }),
    {
      enabled: !!reportId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );
};

export default useGetReport;
