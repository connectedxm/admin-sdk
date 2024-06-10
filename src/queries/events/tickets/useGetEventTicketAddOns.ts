import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";

export const EVENT_TICKET_ADD_ONS_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "ADD_ONS"];

export const SET_EVENT_TICKET_ADD_ONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKET_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketAddOns>>
) => {
  client.setQueryData(EVENT_TICKET_ADD_ONS_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketAddOnsProps extends InfiniteQueryParams {
  eventId: string;
  ticketId: string;
}

export const GetEventTicketAddOns = async ({
  eventId,
  ticketId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventTicketAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/addOns`,
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

const useGetEventTicketAddOns = (eventId: string, ticketId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketAddOns>>
  >(
    EVENT_TICKET_ADD_ONS_QUERY_KEY(eventId, ticketId),
    (params: any) => GetEventTicketAddOns(params),
    {
      eventId,
      ticketId,
    },
    {
      enabled: !!eventId && !!ticketId,
    }
  );
};

export default useGetEventTicketAddOns;
