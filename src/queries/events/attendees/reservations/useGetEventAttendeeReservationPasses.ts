import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_ATTENDEE_RESERVATION_QUERY_KEY } from "./useGetEventAttendeeReservation";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_KEY = (
  eventId: string,
  accountId: string,
  reservationId: string
) => [
  ...EVENT_ATTENDEE_RESERVATION_QUERY_KEY(eventId, accountId, reservationId),
  "PASSES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeeReservationPasses>>
) => {
  client.setQueryData(
    EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAttendeeReservationPassesProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
  reservationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeeReservationPasses = async ({
  eventId,
  accountId,
  reservationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeeReservationPassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/reservations/${reservationId}/passes`,
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
export const useGetEventAttendeeReservationPasses = (
  eventId: string = "",
  accountId: string = "",
  reservationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeReservationPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeReservationPasses>>
  >(
    EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_KEY(
      eventId,
      accountId,
      reservationId
    ),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeReservationPasses({
        ...params,
        eventId,
        accountId,
        reservationId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!accountId &&
        !!reservationId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
