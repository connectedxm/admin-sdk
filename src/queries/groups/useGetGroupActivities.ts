import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

export const GROUP_ACTIVITIES_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "ACTIVITIES",
];

export const SET_GROUP_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupActivities>>
) => {
  client.setQueryData(GROUP_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetGroupActivitiesProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupActivities = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetGroupActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetGroupActivities = (groupId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupActivities>>
  >(
    GROUP_ACTIVITIES_QUERY_KEY(groupId),
    (params: any) => GetGroupActivities(params),
    {
      groupId,
    },
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupActivities;
