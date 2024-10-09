import { ConnectedXMResponse } from "@src/interfaces";

import { EventSpeaker } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPEAKERS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPEAKERS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPEAKERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPEAKERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakers>>
) => {
  client.setQueryData(EVENT_SPEAKERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSpeakersProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSpeakers = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSpeakersProps): Promise<ConnectedXMResponse<EventSpeaker[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/speakers`, {
    params: {
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
export const useGetEventSpeakers = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSpeakers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakers>>
  >(
    EVENT_SPEAKERS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSpeakers({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
