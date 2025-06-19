import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SystemEventLogStatus } from "@src/interfaces";
import { SystemEventLog } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_SYSTEM_LOGS_QUERY_KEY = (
  status?: keyof typeof SystemEventLogStatus,
  trigger?: string
) => {
  const key = [...ORGANIZATION_QUERY_KEY(), "SYSTEM_LOGS"];
  if (status) key.push(status);
  if (trigger) key.push(trigger);
  return key;
};

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_SYSTEM_LOGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_SYSTEM_LOGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationSystemLogs>>
) => {
  client.setQueryData(
    ORGANIZATION_SYSTEM_LOGS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationSystemLogsProps extends InfiniteQueryParams {
  status?: keyof typeof SystemEventLogStatus;
  trigger?: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationSystemLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  trigger,
  adminApiParams,
}: GetOrganizationSystemLogsProps): Promise<
  ConnectedXMResponse<SystemEventLog[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/system-logs`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
      trigger: trigger || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationSystemLogs = (
  status?: keyof typeof SystemEventLogStatus,
  trigger?: string,
  params: Omit<
    GetOrganizationSystemLogsProps,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationSystemLogs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationSystemLogs>>
  >(
    ORGANIZATION_SYSTEM_LOGS_QUERY_KEY(status, trigger),
    (params: InfiniteQueryParams) =>
      GetOrganizationSystemLogs({ ...params, status, trigger }),
    params,
    options,
    "org"
  );
};
