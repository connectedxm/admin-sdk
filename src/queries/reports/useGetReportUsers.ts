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
 * Endpoint to manage and query user report data associated with a specific report.
 * This function allows retrieval of user data linked to a particular report by its ID.
 * It is designed for applications that need to access detailed user information within a report context.
 * @name GetReportUsers
 * @param {string} reportId (path) The id of the report
 * @version 1.3
 **/

export const REPORT_USERS_QUERY_KEY = (
  type: keyof typeof ReportType,
  reportId: string
) => [...REPORT_QUERY_KEY(type, reportId), "USERS"];

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

export const GetReportUsers = async ({
  reportId,
  adminApiParams,
}: GetReportUsersProps): Promise<ConnectedXMResponse<User[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/${reportId}/users`);
  return data;
};

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