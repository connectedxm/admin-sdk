import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Purchase } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";

export const EVENT_TICKET_PURCHASES_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "PURCHASES"];

export const SET_EVENT_TICKET_PURCHASES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKET_PURCHASES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketPurchases>>
) => {
  client.setQueryData(EVENT_TICKET_PURCHASES_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketPurchasesProps extends InfiniteQueryParams {
  eventId: string;
  ticketId: string;
}

export const GetEventTicketPurchases = async ({
  eventId,
  ticketId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventTicketPurchasesProps): Promise<ConnectedXMResponse<Purchase[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/purchases`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetEventTicketPurchases = (eventId: string, ticketId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketPurchases>>
  >(
    EVENT_TICKET_PURCHASES_QUERY_KEY(eventId, ticketId),
    (params: InfiniteQueryParams) => GetEventTicketPurchases(params),
    {
      eventId,
      ticketId,
    },
    {
      enabled: !!ticketId,
    }
  );
};

export default useGetEventTicketPurchases;
