import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY } from "./useGetEventAttendeeReservations";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_RESERVATION_QUERY_KEY = (
  eventId: string,
  accountId: string,
  reservationId: string
) => [
  ...EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY(eventId, accountId),
  reservationId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_RESERVATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ATTENDEE_RESERVATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeeReservation>>
) => {
  client.setQueryData(
    EVENT_ATTENDEE_RESERVATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAttendeeReservationProps extends SingleQueryParams {
  eventId: string;
  accountId: string;
  reservationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeeReservation = async ({
  eventId,
  accountId,
  reservationId,
  adminApiParams,
}: GetEventAttendeeReservationProps): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/reservations/${reservationId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAttendeeReservation = (
  eventId: string,
  accountId: string = "",
  reservationId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeeReservation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeeReservation>
  >(
    EVENT_ATTENDEE_RESERVATION_QUERY_KEY(eventId, accountId, reservationId),
    (params: SingleQueryParams) =>
      GetEventAttendeeReservation({
        eventId,
        accountId,
        reservationId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!accountId &&
        !!reservationId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
