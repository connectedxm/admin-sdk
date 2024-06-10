import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CONTENT_TYPE_QUERY_KEY } from "./useGetContentType";
import { QueryClient } from "@tanstack/react-query";

export const CONTENT_TYPE_KPI_ACTIVITIES_QUERY_KEY = (
  contentTypeId: string
) => [...CONTENT_TYPE_QUERY_KEY(contentTypeId), "KPI_ACTIVITIES"];

export const SET_CONTENT_TYPE_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeKPIActivities>>
) => {
  client.setQueryData(
    CONTENT_TYPE_KPI_ACTIVITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeKPIActivitiesProps {
  contentTypeId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetContentTypeKPIActivities = async ({
  contentTypeId,
}: GetContentTypeKPIActivitiesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contentTypes/${contentTypeId}/kpi/activities`
  );
  return data;
};

const useGetContentTypeKPIActivities = (contentTypeId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentTypeKPIActivities>>((
    CONTENT_TYPE_KPI_ACTIVITIES_QUERY_KEY(contentTypeId),
    () => GetContentTypeKPIActivities({ contentTypeId }),
    {
      enabled: !!contentTypeId,
    }
  );
};

export default useGetContentTypeKPIActivities;
