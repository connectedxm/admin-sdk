import { GetAdminAPI } from "@src/AdminAPI";
import { BaseStandardReport, ConnectedXMResponse } from "@src/interfaces";
import { ReportType } from "@src/interfaces";
import {
  SingleQueryParams,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Reports
 */
export const REPORTS_QUERY_KEY = (type: keyof typeof ReportType) => {
  const keys = ["REPORTS", type];
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

interface GetReportsProps extends SingleQueryParams {
  type: keyof typeof ReportType;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetReports = async ({
  type,
  adminApiParams,
}: GetReportsProps): Promise<ConnectedXMResponse<BaseStandardReport[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports`, {
    params: {
      type,
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
  options: SingleQueryOptions<ReturnType<typeof GetReports>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReports>>(
    REPORTS_QUERY_KEY(type),
    (params: SingleQueryParams) => GetReports({ ...params, type }),
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    },
    "reports"
  );
};
