import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, CustomReportSchedule } from "@src/interfaces";
import { CUSTOM_REPORT_QUERY_KEY } from "./useGetCustomReport";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Reports
 */
export const CUSTOM_REPORT_SCHEDULE_QUERY_KEY = (reportId: number) => [
  ...CUSTOM_REPORT_QUERY_KEY(reportId),
  "schedule",
];

/**
 * @category Setters
 * @group Reports
 */
export const SET_CUSTOM_REPORT_SCHEDULE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_REPORT_SCHEDULE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomReportSchedule>>
) => {
  client.setQueryData(CUSTOM_REPORT_SCHEDULE_QUERY_KEY(...keyParams), response);
};

interface GetCustomReportScheduleProps extends SingleQueryParams {
  reportId: number;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetCustomReportSchedule = async ({
  reportId,
  adminApiParams,
}: GetCustomReportScheduleProps): Promise<
  ConnectedXMResponse<CustomReportSchedule | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<
    ConnectedXMResponse<CustomReportSchedule | null>
  >(`/reports/custom/${reportId}/schedule`);
  return data;
};

/**
 * @category Hooks
 * @group Reports
 */
export const useGetCustomReportSchedule = (
  reportId: number,
  options: SingleQueryOptions<ReturnType<typeof GetCustomReportSchedule>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCustomReportSchedule>>(
    CUSTOM_REPORT_SCHEDULE_QUERY_KEY(reportId),
    (params: SingleQueryParams) =>
      GetCustomReportSchedule({ reportId, ...params }),
    {
      ...options,
      enabled: !!reportId && (options?.enabled ?? true),
    }
  );
};
