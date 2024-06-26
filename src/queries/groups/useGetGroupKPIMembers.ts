import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Groups
 */
export const GROUP_KPI_MEMBERS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "KPI_MEMBERS",
];

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUP_KPI_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_KPI_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupKPIMembers>>
) => {
  client.setQueryData(GROUP_KPI_MEMBERS_QUERY_KEY(...keyParams), response);
};

interface GetGroupKPIMembersProps extends SingleQueryParams {
  groupId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroupKPIMembers = async ({
  groupId,
  adminApiParams,
}: GetGroupKPIMembersProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/kpi/members`);
  return data;
};
/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroupKPIMembers = (
  groupId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroupKPIMembers>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupKPIMembers>>(
    GROUP_KPI_MEMBERS_QUERY_KEY(groupId),
    (params: SingleQueryParams) => GetGroupKPIMembers({ groupId, ...params }),
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
