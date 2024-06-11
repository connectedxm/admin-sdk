import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TICKET_KPI_HOLDERS_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "KPI_HOLDERS"];

export const SET_EVENT_TICKET_KPI_HOLDERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TICKET_KPI_HOLDERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketKPIHolders>>
) => {
  client.setQueryData(
    EVENT_TICKET_KPI_HOLDERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventTicketKPIHoldersProps extends SingleQueryParams {
  eventId: string;
  ticketId?: string;
}

interface UniqueHoldersKPIData {
  totalPurchases: number;
  uniqueHolders: number;
}

export const GetEventTicketKPIHolders = async ({
  eventId,
  ticketId,
  adminApiParams,
}: GetEventTicketKPIHoldersProps): Promise<
  ConnectedXMResponse<UniqueHoldersKPIData>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/kpi/uniqueHolders`
  );
  return data;
};

const useGetEventTicketKPIHolders = (
  eventId: string = "",
  ticketId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTicketKPIHolders>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketKPIHolders>>(
    EVENT_TICKET_KPI_HOLDERS_QUERY_KEY(eventId, ticketId),
    (params: SingleQueryParams) =>
      GetEventTicketKPIHolders({ eventId, ticketId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!ticketId,
    }
  );
};

export default useGetEventTicketKPIHolders;
