import { GetAdminAPI } from '@src/AdminAPI';
import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_KPI_COMMENTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "KPI_COMMENTS",
];

export const SET_ACTIVITY_KPI_COMMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_KPI_COMMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityKPIComments>>
) => {
  client.setQueryData(ACTIVITY_KPI_COMMENTS_QUERY_KEY(...keyParams), response);
};

interface GetActivityKPICommentsProps {
  activityId?: string;
}

interface DateCount {
  day: string;
  count: number;
}

export const GetActivityKPIComments = async ({
  activityId,
}: GetActivityKPICommentsProps): Promise<ConnectedXMResponse<DateCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/kpi/comments`);
  return data;
};

const useGetActivityKPIComments = (activityId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivityKPIComments>>((
    ACTIVITY_KPI_COMMENTS_QUERY_KEY(activityId),
    () => GetActivityKPIComments({ activityId }),
    {
      enabled: !!activityId,
    }
  );
};

export default useGetActivityKPIComments;
