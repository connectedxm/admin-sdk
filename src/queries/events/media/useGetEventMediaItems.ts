import { ConnectedXMResponse } from "@src/interfaces";
import { EventMediaItem } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MEDIA_ITEMS_QUERY_KEY = (
  eventId: string,
  type?: "image" | "video" | "file"
) => {
  const key = [...EVENT_QUERY_KEY(eventId), "MEDIA"];
  if (type) {
    key.push(type);
  }
  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MEDIA_ITEMS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEMS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItems>>
) => {
  client.setQueryData(EVENT_MEDIA_ITEMS_QUERY_KEY(...keyParams), response);
};

interface GetEventMediaItemsProps extends InfiniteQueryParams {
  eventId: string;
  type?: "image" | "video" | "file";
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMediaItems = async ({
  eventId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventMediaItemsProps): Promise<ConnectedXMResponse<EventMediaItem[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/media`, {
    params: {
      type,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventMediaItems = (
  eventId: string = "",
  type?: "image" | "video" | "file",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventMediaItems>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventMediaItems>>
  >(
    EVENT_MEDIA_ITEMS_QUERY_KEY(eventId, type),
    (params: InfiniteQueryParams) =>
      GetEventMediaItems({ eventId, type, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
