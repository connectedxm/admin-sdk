import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITIES_QUERY_KEY = () => ["ACTIVITIES"];

export const SET_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivities>>
) => {
  client.setQueryData(ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetActivitiesProps extends InfiniteQueryParams {}

export const GetActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetActivities = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetActivities>>>(
    ACTIVITIES_QUERY_KEY(),
    (params: any) => GetActivities(params),
    {},
    {}
  );
};

export default useGetActivities;
