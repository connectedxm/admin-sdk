import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassStatus } from "@src/interfaces";
import { EventAttendee } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEES_QUERY_KEY = (
  eventId: string,
  status?: EventPassStatus
) => {
  const keys = [...EVENT_QUERY_KEY(eventId), "ATTENDEES"];
  if (status) keys.push(status);
  return keys;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendees>>
) => {
  client.setQueryData(EVENT_ATTENDEES_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeesProps extends InfiniteQueryParams {
  eventId: string;
  status?: EventPassStatus;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendees = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  adminApiParams,
}: GetEventAttendeesProps): Promise<ConnectedXMResponse<EventAttendee[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/attendees`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAttendees = (
  eventId: string,
  status?: EventPassStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendees>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendees>>
  >(
    EVENT_ATTENDEES_QUERY_KEY(eventId, status),
    (params: InfiniteQueryParams) =>
      GetEventAttendees({
        ...params,
        eventId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
