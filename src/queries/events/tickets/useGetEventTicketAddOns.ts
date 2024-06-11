import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";
import { GetAdminAPI } from "@src/AdminAPI";

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
  adminApiParams,
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

const useGetEventTicketAddOns = (
  eventId: string = "",
  ticketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTicketAddOns>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketAddOns>>
  >(
    EVENT_TICKET_ADD_ONS_QUERY_KEY(eventId, ticketId),
    (params: InfiniteQueryParams) =>
      GetEventTicketAddOns({
        ...params,
        eventId,
        ticketId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!ticketId && (options.enabled ?? true),
    }
  );
};

export default useGetEventTicketAddOns;
