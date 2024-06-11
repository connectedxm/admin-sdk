import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Activities
 */
export const ACTIVITY_KPI_COMMENTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "KPI_COMMENTS",
];

/**
 * @category Setters
 * @group Activities
 */
export const SET_ACTIVITY_KPI_COMMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_KPI_COMMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityKPIComments>>
) => {
  client.setQueryData(ACTIVITY_KPI_COMMENTS_QUERY_KEY(...keyParams), response);
};

interface GetActivityKPICommentsProps extends SingleQueryParams {
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
export const GetActivityKPIComments = async ({
  activityId,
  adminApiParams,
}: GetActivityKPICommentsProps): Promise<ConnectedXMResponse<DateCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/kpi/comments`);
  return data;
};
/**
 * @category Hooks
 * @group Activities
 */
export const useGetActivityKPIComments = (
  activityId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetActivityKPIComments>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivityKPIComments>>(
    ACTIVITY_KPI_COMMENTS_QUERY_KEY(activityId),
    (params: SingleQueryParams) =>
      GetActivityKPIComments({ activityId, ...params }),
    {
      ...options,
      enabled: !!activityId,
    }
  );
};
