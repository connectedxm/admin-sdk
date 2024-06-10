import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
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

interface GetEventTicketKPIHoldersProps {
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
}: GetEventTicketKPIHoldersProps): Promise<
  ConnectedXMResponse<UniqueHoldersKPIData>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/kpi/uniqueHolders`
  );
  return data;
};

const useGetEventTicketKPIHolders = (eventId: string, ticketId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketKPIHolders>>((
    EVENT_TICKET_KPI_HOLDERS_QUERY_KEY(eventId, ticketId),
    () => GetEventTicketKPIHolders({ eventId, ticketId }),
    {
      enabled: !!eventId && !!ticketId,
    }
  );
};

export default useGetEventTicketKPIHolders;
