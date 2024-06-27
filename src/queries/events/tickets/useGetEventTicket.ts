import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTicket } from "@src/interfaces";
import { EVENT_TICKETS_QUERY_KEY } from "./useGetEventTickets";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TICKET_QUERY_KEY = (eventId: string, ticketId: string) => [
  ...EVENT_TICKETS_QUERY_KEY(eventId),
  ticketId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TICKET_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TICKET_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicket>>
) => {
  client.setQueryData(EVENT_TICKET_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketProps extends SingleQueryParams {
  eventId: string;
  ticketId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTicket = async ({
  eventId,
  ticketId,
  adminApiParams,
}: GetEventTicketProps): Promise<ConnectedXMResponse<EventTicket>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tickets/${ticketId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventTicket = (
  eventId: string = "",
  ticketId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTicket>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicket>>(
    EVENT_TICKET_QUERY_KEY(eventId, ticketId),
    (params: SingleQueryParams) =>
      GetEventTicket({ eventId, ticketId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!ticketId && (options?.enabled ?? true),
    }
  );
};
