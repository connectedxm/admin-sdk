import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_TICKETS_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_TICKETS",
];

interface GetEventKPITicketsProps extends SingleQueryParams {
  eventId?: string;
}

interface TicketCount {
  name: string;
  count: number;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventKPITickets = async ({
  eventId,
  adminApiParams,
}: GetEventKPITicketsProps): Promise<ConnectedXMResponse<TicketCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/tickets`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventKPITickets = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventKPITickets>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPITickets>>(
    EVENT_QUERY_KPI_TICKETS_KEY(eventId),
    (params: SingleQueryParams) => GetEventKPITickets({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
