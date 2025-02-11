import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../../useGetEvent";

/**
 * Endpoint to manage and retrieve reservations for a specific event.
 * This function provides the ability to fetch reservation details associated with a given event ID.
 * It is designed to be used in applications that require access to event reservation data.
 * @name GetEventReservations
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

export const EVENT_RESERVATIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "RESERVATIONS",
];

export const SET_EVENT_RESERVATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_RESERVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservations>>
) => {
  client.setQueryData(EVENT_RESERVATIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventReservationsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventReservations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventReservationsProps): Promise<
  ConnectedXMResponse<EventRoomTypeReservation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/reservations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventReservations = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventReservations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservations>>
  >(
    EVENT_RESERVATIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventReservations({
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
