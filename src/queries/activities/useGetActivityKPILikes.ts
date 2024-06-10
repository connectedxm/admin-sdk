import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_KPI_LIKES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "KPI_LIKES",
];

export const SET_ACTIVITY_KPI_LIKES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_KPI_LIKES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityKPILikes>>
) => {
  client.setQueryData(ACTIVITY_KPI_LIKES_QUERY_KEY(...keyParams), response);
};

interface GetActivityKPILikesProps {
  activityId?: string;
}

interface DateCount {
  day: string;
  count: number;
}

export const GetActivityKPILikes = async ({
  activityId,
}: GetActivityKPILikesProps): Promise<ConnectedXMResponse<DateCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/kpi/likes`);
  return data;
};

const useGetActivityKPILikes = (activityId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivityKPILikes>>((
    ACTIVITY_KPI_LIKES_QUERY_KEY(activityId),
    () => GetActivityKPILikes({ activityId }),
    {
      enabled: !!activityId,
    }
  );
};

export default useGetActivityKPILikes;
