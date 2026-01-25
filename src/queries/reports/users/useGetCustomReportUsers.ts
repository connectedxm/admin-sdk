import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { User } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Reports
 */
export const CUSTOM_REPORT_USERS_QUERY_KEY = (reportId: number) => [
  "CUSTOM_REPORT_USERS",
  reportId,
];

/**
 * @category Setters
 * @group Reports
 */
export const SET_CUSTOM_REPORT_USERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_REPORT_USERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomReportUsers>>
) => {
  client.setQueryData(CUSTOM_REPORT_USERS_QUERY_KEY(...keyParams), response);
};

interface GetCustomReportUsersProps extends SingleQueryParams {
  reportId: number;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetCustomReportUsers = async ({
  reportId,
  adminApiParams,
}: GetCustomReportUsersProps): Promise<ConnectedXMResponse<User[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<User[]>>(
    `/reports/custom/${reportId}/users`
  );
  return data;
};

/**
 * @category Hooks
 * @group Reports
 */
export const useGetCustomReportUsers = (
  reportId: number,
  options: SingleQueryOptions<ReturnType<typeof GetCustomReportUsers>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCustomReportUsers>>(
    CUSTOM_REPORT_USERS_QUERY_KEY(reportId),
    (params: SingleQueryParams) =>
      GetCustomReportUsers({ reportId, ...params }),
    {
      ...options,
      enabled: !!reportId && (options?.enabled ?? true),
    }
  );
};
