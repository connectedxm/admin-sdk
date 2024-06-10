import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_TICKETS_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_TICKETS",
];

interface GetEventKPITicketsProps {
  eventId?: string;
}

interface TicketCount {
  name: string;
  count: number;
}

export const GetEventKPITickets = async ({
  eventId,
}: GetEventKPITicketsProps): Promise<ConnectedXMResponse<TicketCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/tickets`);
  return data;
};

const useGetEventKPITickets = (eventId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPITickets>>((
    EVENT_QUERY_KPI_TICKETS_KEY(eventId),
    () => GetEventKPITickets({ eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventKPITickets;
