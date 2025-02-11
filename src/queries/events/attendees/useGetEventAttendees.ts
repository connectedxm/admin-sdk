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
 * Fetches and manages a list of attendees for a specific event, with support for pagination and optional filtering by event pass status.
 * This function is designed to be used in applications that require detailed attendee information for events, allowing for efficient data retrieval and management.
 * @name GetEventAttendees
 * @param {string} eventId (path) The id of the event
 * @param {EventPassStatus} [status] (query) Optional status of the event pass
 * @version 1.3
 **/

export const EVENT_ATTENDEES_QUERY_KEY = (
  eventId: string,
  status?: EventPassStatus
) => {
  const keys = [...EVENT_QUERY_KEY(eventId), "ATTENDEES"];
  if (status) keys.push(status);
  return keys;
};

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
