import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CONTENT_TYPE_CONTENT_QUERY_KEY } from "./useGetContentTypeContent";
import { QueryClient } from "@tanstack/react-query";

export const CONTENT_TYPE_CONTENT_KPI_ACTIVITIES_QUERY_KEY = (
  contentTypeId: string,
  contentId: string
) => [
  ...CONTENT_TYPE_CONTENT_QUERY_KEY(contentTypeId, contentId),
  "KPI_ACTIVITIES",
];

export const SET_CONTENT_TYPE_CONTENT_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENT_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentKPIActivities>>
) => {
  client.setQueryData(
    CONTENT_TYPE_CONTENT_KPI_ACTIVITIES_QUERY_KEY(...keyParams),
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
  contentTypeId: string,
  contentId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentKPIActivities>>((
    CONTENT_TYPE_CONTENT_KPI_ACTIVITIES_QUERY_KEY(contentTypeId, contentId),
    () => GetContentKPIActivities({ contentId }),
    {
      enabled: !!contentId,
    }
  );
};

export default useGetContentKPIActivities;
