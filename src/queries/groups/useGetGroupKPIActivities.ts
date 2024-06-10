import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";

export const GROUP_KPI_ACTIVITIES_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "KPI_ACTIVITIES",
];

export const SET_GROUP_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupKPIActivities>>
) => {
  client.setQueryData(GROUP_KPI_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetGroupKPIActivitiesProps {
  groupId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetGroupKPIActivities = async ({
  groupId,
}: GetGroupKPIActivitiesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/kpi/activities`);
  return data;
};

const useGetGroupKPIActivities = (groupId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupKPIActivities>>((
    GROUP_KPI_ACTIVITIES_QUERY_KEY(groupId),
    () => GetGroupKPIActivities({ groupId }),
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupKPIActivities;
