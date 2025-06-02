import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_MEDIA_ITEM_QUERY_KEY } from "./useGetEventMediaItem";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  mediaItemId: string
) => [...EVENT_MEDIA_ITEM_QUERY_KEY(eventId, mediaItemId), "PASS_TYPES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItemPassTypes>>
) => {
  client.setQueryData(
    EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventMediaItemPassTypesProps extends InfiniteQueryParams {
  eventId: string;
  mediaItemId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMediaItemPassTypes = async ({
  eventId,
  mediaItemId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventMediaItemPassTypesProps): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/media/${mediaItemId}/passTypes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventMediaItemPassTypes = (
  eventId: string = "",
  mediaItemId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventMediaItemPassTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventMediaItemPassTypes>>
  >(
    EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_KEY(eventId, mediaItemId),
    (params: InfiniteQueryParams) =>
      GetEventMediaItemPassTypes({
        ...params,
        eventId,
        mediaItemId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!mediaItemId && (options.enabled ?? true),
    },
    "events"
  );
};
