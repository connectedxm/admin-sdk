import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";

export const CHANNEL_KPI_ACTIVITIES_QUERY_KEY = (
  channelId: string
) => [...CHANNEL_QUERY_KEY(channelId), "KPI_ACTIVITIES"];

export const SET_CHANNEL_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelKPIActivities>>
) => {
  client.setQueryData(
    CHANNEL_KPI_ACTIVITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelKPIActivitiesProps {
  channelId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetChannelKPIActivities = async ({
  channelId,
}: GetChannelKPIActivitiesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/kpi/activities`
  );
  return data;
};

const useGetChannelKPIActivities = (channelId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelKPIActivities>>((
    CHANNEL_KPI_ACTIVITIES_QUERY_KEY(channelId),
    () => GetChannelKPIActivities({ channelId }),
    {
      enabled: !!channelId,
    }
  );
};

export default useGetChannelKPIActivities;
