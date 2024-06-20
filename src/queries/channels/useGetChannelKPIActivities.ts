import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Contents
 */
export const CHANNEL_KPI_ACTIVITIES_QUERY_KEY = (channelId: string) => [
  ...CHANNEL_QUERY_KEY(channelId),
  "KPI_ACTIVITIES",
];

/**
 * @category Setters
 * @group Contents
 */
export const SET_CHANNEL_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelKPIActivities>>
) => {
  client.setQueryData(CHANNEL_KPI_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetChannelKPIActivitiesProps extends SingleQueryParams {
  channelId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

/**
 * @category Queries
 * @group Contents
 */
export const GetChannelKPIActivities = async ({
  channelId,
  adminApiParams,
}: GetChannelKPIActivitiesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}/kpi/activities`);
  return data;
};
/**
 * @category Hooks
 * @group Contents
 */
export const useGetChannelKPIActivities = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelKPIActivities>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelKPIActivities>>(
    CHANNEL_KPI_ACTIVITIES_QUERY_KEY(channelId),
    (params) => GetChannelKPIActivities({ channelId, ...params }),
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
