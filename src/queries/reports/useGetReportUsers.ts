import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, User } from "@src/interfaces";
import { ReportType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { REPORT_QUERY_KEY } from "./useGetReport";

/**
 * @category Keys
 * @group Reports
 */
export const REPORT_USERS_QUERY_KEY = (
  type: keyof typeof ReportType,
  reportId: string
) => [...REPORT_QUERY_KEY(type, reportId), "USERS"];

/**
 * @category Setters
 * @group Reports
 */
export const SET_REPORT_USERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORT_USERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReportUsers>>
) => {
  client.setQueryData(REPORT_USERS_QUERY_KEY(...keyParams), response);
};

interface GetReportUsersProps extends SingleQueryParams {
  reportId: string;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetReportUsers = async ({
  reportId,
  adminApiParams,
}: GetReportUsersProps): Promise<ConnectedXMResponse<User[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/${reportId}/users`);
  return data;
};
/**
 * @category Hooks
 * @group Reports
 */
export const useGetReportUsers = (
  reportId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetReportUsers>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReportUsers>>(
    REPORT_USERS_QUERY_KEY("organization", reportId),
    (params: SingleQueryParams) => GetReportUsers({ reportId, ...params }),
    {
      ...options,
      enabled: !!reportId,
    },
    "reports"
  );
};
