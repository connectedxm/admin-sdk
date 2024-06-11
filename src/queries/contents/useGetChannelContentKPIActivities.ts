import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

export const CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "KPI_ACTIVITIES"];

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

interface GetContentKPIEngagActivities extends SingleQueryParams {
  contentId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetContentKPIActivities = async ({
  contentId,
  adminApiParams,
}: GetContentKPIEngagActivities): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/kpi/activities`);
  return data;
};

const useGetContentKPIActivities = (
  channelId: string = "",
  contentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetContentKPIActivities>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentKPIActivities>>(
    CHANNEL_CONTENT_KPI_ACTIVITIES_QUERY_KEY(channelId, contentId),
    (params: SingleQueryParams) =>
      GetContentKPIActivities({ contentId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};

export default useGetContentKPIActivities;
