import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @event Events
 */
export const EVENT_ACTIVITIES_QUERY_KEY = (
  eventId: string,
  featured?: true
) => {
  const key = [...EVENT_QUERY_KEY(eventId), "ACTIVITIES"];
  if (featured) {
    key.push("FEATURED");
  }
  return key;
};

/**
 * @category Setters
 * @event Events
 */
export const SET_EVENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivities>>
) => {
  client.setQueryData(EVENT_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetEventActivitiesProps extends InfiniteQueryParams {
  eventId: string;
  featured?: true;
}

/**
 * @category Queries
 * @event Events
 */
export const GetEventActivities = async ({
  eventId,
  featured,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      featured: featured || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @event Events
 */
export const useGetEventActivities = (
  eventId: string = "",
  featured?: true,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivities>>
  >(
    EVENT_ACTIVITIES_QUERY_KEY(eventId, featured),
    (params: InfiniteQueryParams) =>
      GetEventActivities({
        eventId,
        featured,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
