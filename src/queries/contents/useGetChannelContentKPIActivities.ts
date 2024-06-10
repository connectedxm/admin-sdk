import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";
import { QueryClient } from "@tanstack/react-query";

export const CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [
  ...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
  "KPI_ACTIVITIES",
];

export const SET_CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentKPIActivities>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentKPIEngagActivities {
  contentId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetContentKPIActivities = async ({
  contentId,
}: GetContentKPIEngagActivities): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/kpi/activities`);
  return data;
};

const useGetContentKPIActivities = (
  channelId: string,
  contentId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentKPIActivities>>((
    CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_KEY(channelId, contentId),
    () => GetContentKPIActivities({ contentId }),
    {
      enabled: !!contentId,
    }
  );
};

export default useGetContentKPIActivities;
