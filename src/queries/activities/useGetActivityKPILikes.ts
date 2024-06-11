import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Activities
 */
export const ACTIVITY_KPI_LIKES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "KPI_LIKES",
];

/**
 * @category Setters
 * @group Activities
 */
export const SET_ACTIVITY_KPI_LIKES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_KPI_LIKES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityKPILikes>>
) => {
  client.setQueryData(ACTIVITY_KPI_LIKES_QUERY_KEY(...keyParams), response);
};

interface GetActivityKPILikesProps extends SingleQueryParams {
  activityId?: string;
}

interface DateCount {
  day: string;
  count: number;
}

/**
 * @category Queries
 * @group Activities
 */
export const GetActivityKPILikes = async ({
  activityId,
  adminApiParams,
}: GetActivityKPILikesProps): Promise<ConnectedXMResponse<DateCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/kpi/likes`);
  return data;
};
/**
 * @category Hooks
 * @group Activities
 */
export const useGetActivityKPILikes = (
  activityId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetActivityKPILikes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivityKPILikes>>(
    ACTIVITY_KPI_LIKES_QUERY_KEY(activityId),
    (params: SingleQueryParams) =>
      GetActivityKPILikes({ activityId, ...params }),
    {
      ...options,
      enabled: !!activityId,
    }
  );
};
