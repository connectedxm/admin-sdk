import { ConnectedXMResponse, EventPassStatus } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTENDEE_QUERY_KEY } from "./useGetEventAttendee";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_PASSES_QUERY_KEY = (
  eventId: string,
  attendeeId: string,
  status?: keyof typeof EventPassStatus
) => {
  const key = [...EVENT_ATTENDEE_QUERY_KEY(eventId, attendeeId), "PASSES"];

  if (status) {
    key.push(status);
  }

  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePasses>>
) => {
  client.setQueryData(EVENT_ATTENDEE_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeePassesProps extends InfiniteQueryParams {
  eventId: string;
  attendeeId: string;
  status?: keyof typeof EventPassStatus;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeePasses = async ({
  eventId,
  attendeeId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeePassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${attendeeId}/passes`,
    {
      params: {
        status: status || undefined,
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
export const useGetEventAttendeePasses = (
  eventId: string = "",
  attendeeId: string = "",
  status?: keyof typeof EventPassStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeePasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeePasses>>
  >(
    EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, attendeeId, status),
    (params: InfiniteQueryParams) =>
      GetEventAttendeePasses({
        ...params,
        eventId,
        attendeeId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!attendeeId && (options.enabled ?? true),
    },
    "events"
  );
};
