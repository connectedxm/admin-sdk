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
export const ACTIVITY_KPI_RESHARES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "KPI_RESHARES",
];

/**
 * @category Setters
 * @group Activities
 */
export const SET_ACTIVITY_KPI_RESHARES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_KPI_RESHARES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityKPIReshares>>
) => {
  client.setQueryData(ACTIVITY_KPI_RESHARES_QUERY_KEY(...keyParams), response);
};

interface GetActivityKPIResharesProps extends SingleQueryParams {
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
export const GetActivityKPIReshares = async ({
  activityId,
  adminApiParams,
}: GetActivityKPIResharesProps): Promise<ConnectedXMResponse<DateCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/kpi/reshares`);
  return data;
};
/**
 * @category Hooks
 * @group Activities
 */
export const useGetActivityKPIReshares = (
  activityId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetActivityKPIReshares>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetActivityKPIReshares>>(
    ACTIVITY_KPI_RESHARES_QUERY_KEY(activityId),
    (params: SingleQueryParams) =>
      GetActivityKPIReshares({ activityId, ...params }),
    {
      ...options,
      enabled: !!activityId && (options?.enabled ?? true),
    }
  );
};
