import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
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

interface GetEventTicketProps {
  eventId: string;
  ticketId: string;
}

export const GetEventTicket = async ({
  eventId,
  ticketId,
}: GetEventTicketProps): Promise<ConnectedXMResponse<Ticket>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tickets/${ticketId}`);
  return data;
};

const useGetEventTicket = (eventId: string, ticketId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicket>>(
    EVENT_TICKET_QUERY_KEY(eventId, ticketId),
    () => GetEventTicket({ eventId, ticketId: ticketId || "unknown" }),
    {
      enabled: !!eventId && !!ticketId,
    }
  );
};

export default useGetEventTicket;
