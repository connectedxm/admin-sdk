import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Ticket } from "@src/interfaces";
import { EVENT_TICKETS_QUERY_KEY } from "./useGetEventTickets";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TICKET_QUERY_KEY = (eventId: string, ticketId: string) => [
  ...EVENT_TICKETS_QUERY_KEY(eventId),
  ticketId,
];

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

export const GetEventTicket = async ({
  eventId,
  ticketId,
  adminApiParams,
}: GetEventTicketProps): Promise<ConnectedXMResponse<Ticket>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tickets/${ticketId}`);
  return data;
};
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
