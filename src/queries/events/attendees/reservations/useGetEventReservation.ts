import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_RESERVATIONS_QUERY_KEY } from "./useGetEventReservations";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_RESERVATION_QUERY_KEY = (
  eventId: string,
  reservationId: string
) => [...EVENT_RESERVATIONS_QUERY_KEY(eventId), reservationId];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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

/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
