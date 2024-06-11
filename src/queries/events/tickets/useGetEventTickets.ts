import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Ticket } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_TICKETS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "TICKETS",
];

export const SET_EVENT_TICKETS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTickets>>
) => {
  client.setQueryData(EVENT_TICKETS_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventTickets = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventTicketsProps): Promise<ConnectedXMResponse<Ticket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tickets`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventTickets = (eventId: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventTickets>>(
    EVENT_TICKETS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventTickets(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventTickets;
