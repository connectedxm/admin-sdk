import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY = (
  eventId: string,
  accountId: string
) => [...EVENT_ATTENDEE_QUERY_KEY(eventId, accountId), "RESERVATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_RESERVATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeeReservations>>
) => {
  client.setQueryData(
    EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAttendeeReservationsProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeeReservations = async ({
  eventId,
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeeReservationsProps): Promise<
  ConnectedXMResponse<EventRoomTypeReservation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/reservations`,
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
export const useGetEventAttendeeReservations = (
  eventId: string,
  accountId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeReservations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeReservations>>
  >(
    EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY(eventId, accountId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeReservations({
        ...params,
        eventId,
        accountId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!accountId && (options.enabled ?? true),
    },
    "events"
  );
};
