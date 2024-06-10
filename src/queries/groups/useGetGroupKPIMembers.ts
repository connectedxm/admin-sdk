import { GetAdminAPI } from '@src/AdminAPI';
import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

export const GROUP_KPI_MEMBERS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "KPI_MEMBERS",
];

export const SET_GROUP_KPI_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_KPI_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupKPIMembers>>
) => {
  client.setQueryData(GROUP_KPI_MEMBERS_QUERY_KEY(...keyParams), response);
};

interface GetGroupKPIMembersProps {
  groupId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetGroupKPIMembers = async ({
  groupId,
}: GetGroupKPIMembersProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/kpi/members`);
  return data;
};

const useGetGroupKPIMembers = (groupId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupKPIMembers>>((
    GROUP_KPI_MEMBERS_QUERY_KEY(groupId),
    () => GetGroupKPIMembers({ groupId }),
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupKPIMembers;
