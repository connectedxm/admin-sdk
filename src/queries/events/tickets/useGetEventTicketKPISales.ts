import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TICKET_KPI_SALES_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "KPI_SALES"];

export const SET_EVENT_TICKET_KPI_SALES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TICKET_KPI_SALES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketKPISales>>
) => {
  client.setQueryData(EVENT_TICKET_KPI_SALES_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketKPISalesProps {
  eventId: string;
  ticketId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetEventTicketKPISales = async ({
  eventId,
  ticketId,
}: GetEventTicketKPISalesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/kpi/sales`
  );
  return data;
};

const useGetEventTicketKPISales = (eventId: string, ticketId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketKPISales>>((
    EVENT_TICKET_KPI_SALES_QUERY_KEY(eventId, ticketId),
    () => GetEventTicketKPISales({ eventId, ticketId }),
    {
      enabled: !!eventId && !!ticketId,
    }
  );
};

export default useGetEventTicketKPISales;
