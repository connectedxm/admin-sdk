import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TICKET_KPI_SALES_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "KPI_SALES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TICKET_KPI_SALES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TICKET_KPI_SALES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketKPISales>>
) => {
  client.setQueryData(EVENT_TICKET_KPI_SALES_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketKPISalesProps extends SingleQueryParams {
  eventId: string;
  ticketId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTicketKPISales = async ({
  eventId,
  ticketId,
  adminApiParams,
}: GetEventTicketKPISalesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/kpi/sales`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventTicketKPISales = (
  eventId: string = "",
  ticketId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTicketKPISales>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketKPISales>>(
    EVENT_TICKET_KPI_SALES_QUERY_KEY(eventId, ticketId),
    (params: SingleQueryParams) =>
      GetEventTicketKPISales({ eventId, ticketId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!ticketId && (options?.enabled ?? true),
    }
  );
};
