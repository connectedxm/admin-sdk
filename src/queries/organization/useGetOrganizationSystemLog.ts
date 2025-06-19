import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SystemEventLog } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_SYSTEM_LOGS_QUERY_KEY } from "./useGetOrganizationSystemLogs";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_SYSTEM_LOG_QUERY_KEY = (logId: string) => [
  ...ORGANIZATION_SYSTEM_LOGS_QUERY_KEY(),
  logId,
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_SYSTEM_LOG_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_SYSTEM_LOG_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationSystemLog>>
) => {
  client.setQueryData(
    ORGANIZATION_SYSTEM_LOG_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationSystemLogProps extends SingleQueryParams {
  logId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationSystemLog = async ({
  logId,
  adminApiParams,
}: GetOrganizationSystemLogProps): Promise<
  ConnectedXMResponse<SystemEventLog>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/system-logs/${logId}`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationSystemLog = (
  logId: string,
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationSystemLog>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationSystemLog>>(
    ORGANIZATION_SYSTEM_LOG_QUERY_KEY(logId),
    (params: SingleQueryParams) =>
      GetOrganizationSystemLog({ ...params, logId }),
    options,
    "org"
  );
};
