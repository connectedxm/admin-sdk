import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_RESERVATIONS_QUERY_KEY } from "./useGetEventReservations";

/**
 * Fetches and manages event reservation details for a specific event and reservation ID.
 * This module provides functionality to retrieve reservation data and update query data for event reservations.
 * It is designed to be used in applications where detailed information about event reservations is required.
 * @name GetEventReservation
 * @param {string} eventId - The id of the event
 * @param {string} reservationId - The id of the reservation
 * @version 1.2
 **/

export const EVENT_RESERVATION_QUERY_KEY = (
  eventId: string,
  reservationId: string
) => [...EVENT_RESERVATIONS_QUERY_KEY(eventId), reservationId];

export const SET_EVENT_RESERVATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservation>>
) => {
  client.setQueryData(EVENT_RESERVATION_QUERY_KEY(...keyParams), response);
};

interface GetEventReservationProps extends SingleQueryParams {
  eventId: string;
  reservationId: string;
}

export const GetEventReservation = async ({
  eventId,
  reservationId,
  adminApiParams,
}: GetEventReservationProps): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservations/${reservationId}`
  );
  return data;
};

export const useGetEventReservation = (
  eventId: string,
  reservationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventReservation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventReservation>>(
    EVENT_RESERVATION_QUERY_KEY(eventId, reservationId),
    (params: SingleQueryParams) =>
      GetEventReservation({
        eventId,
        reservationId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!reservationId && (options?.enabled ?? true),
    },
    "events"
  );
};