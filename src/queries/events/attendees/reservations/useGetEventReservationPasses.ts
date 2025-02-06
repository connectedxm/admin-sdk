import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_RESERVATION_QUERY_KEY } from "./useGetEventReservation";

/**
 * Fetches and manages event reservation passes for a specific event and reservation.
 * This function is used to retrieve and set data related to passes associated with event reservations.
 * It is designed to be used in applications that require detailed information about event reservation passes.
 * @name GetEventReservationPasses
 * @param {string} eventId (path) - The id of the event
 * @param {string} reservationId (path) - The id of the reservation
 * @version 1.3
 **/

export const EVENT_RESERVATION_PASSES_QUERY_KEY = (
  eventId: string,
  reservationId: string
) => [...EVENT_RESERVATION_QUERY_KEY(eventId, reservationId), "PASSES"];

export const SET_EVENT_RESERVATION_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_RESERVATION_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservationPasses>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationPassesProps extends InfiniteQueryParams {
  eventId: string;
  reservationId: string;
}

export const GetEventReservationPasses = async ({
  eventId,
  reservationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventReservationPassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservations/${reservationId}/passes`,
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

export const useGetEventReservationPasses = (
  eventId: string = "",
  reservationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventReservationPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationPasses>>
  >(
    EVENT_RESERVATION_PASSES_QUERY_KEY(eventId, reservationId),
    (params: InfiniteQueryParams) =>
      GetEventReservationPasses({
        ...params,
        eventId,
        reservationId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!reservationId && (options.enabled ?? true),
    },
    "events"
  );
};