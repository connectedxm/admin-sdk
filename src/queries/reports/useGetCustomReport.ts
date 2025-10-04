import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CustomReport } from "@src/interfaces";
import { CUSTOM_REPORTS_QUERY_KEY } from "./useGetCustomReports";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Reports
 */
export const CUSTOM_REPORT_QUERY_KEY = (reportId: number) => [
  ...CUSTOM_REPORTS_QUERY_KEY(),
  reportId,
];

/**
 * @category Setters
 * @group Reports
 */
export const SET_CUSTOM_REPORT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_REPORT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomReport>>
) => {
  client.setQueryData(CUSTOM_REPORT_QUERY_KEY(...keyParams), response);
};

interface GetCustomReportProps extends SingleQueryParams {
  reportId: number;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetCustomReport = async ({
  reportId,
  adminApiParams,
}: GetCustomReportProps): Promise<ConnectedXMResponse<CustomReport>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/custom/${reportId}`);
  return data;
};

/**
 * @category Hooks
 * @group Reports
 */
export const useGetCustomReport = (
  reportId: number,
  options: SingleQueryOptions<ReturnType<typeof GetCustomReport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCustomReport>>(
    CUSTOM_REPORT_QUERY_KEY(reportId),
    (params: SingleQueryParams) => GetCustomReport({ reportId, ...params }),
    {
      ...options,
      enabled: !!reportId && (options?.enabled ?? true),
    }
  );
};
