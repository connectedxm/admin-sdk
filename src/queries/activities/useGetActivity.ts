import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import { ACTIVITIES_QUERY_KEY } from "./useGetActivities";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_QUERY_KEY = (activityId: string) => [
  ...ACTIVITIES_QUERY_KEY(),
  activityId,
];

export const SET_ACTIVITY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivity>>
) => {
  client.setQueryData(ACTIVITY_QUERY_KEY(...keyParams), response);
};

interface GetActivityProps extends SingleQueryParams {
  activityId: string;
}

export const GetActivity = async ({
  activityId,
  adminApiParams,
}: GetActivityProps): Promise<ConnectedXMResponse<Activity>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}`);
  return data;
};

const useGetActivity = (
  activityId: string,
  options: SingleQueryOptions<ReturnType<typeof GetActivity>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivity>>(
    ACTIVITY_QUERY_KEY(activityId),
    (params: SingleQueryParams) => GetActivity({ activityId, ...params }),
    {
      ...options,
      enabled: !!activityId && (options?.enabled ?? true),
    }
  );
};

export default useGetActivity;
