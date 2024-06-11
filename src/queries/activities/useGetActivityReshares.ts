import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_RESHARES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "RESHARES",
];

export const SET_ACTIVITY_RESHARES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_RESHARES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityReshares>>
) => {
  client.setQueryData(ACTIVITY_RESHARES_QUERY_KEY(...keyParams), response);
};

interface GetActivityResharesProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityReshares = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetActivityResharesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/reshares`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const QUERY_KEY = "ACTIVITY_RESHARES";
export const useGetActivityReshares = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityReshares>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityReshares>>
  >(
    [QUERY_KEY, activityId],
    (params: InfiniteQueryParams) =>
      GetActivityReshares({ activityId, ...params }),
    params,
    {
      ...options,
      enabled: !!activityId && (options.enabled ?? true),
    }
  );
};
