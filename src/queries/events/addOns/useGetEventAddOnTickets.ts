import { ConnectedXMResponse } from "@src/interfaces";
import { Ticket } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "./useGetEventAddOn";

export const EVENT_ADD_ON_TICKETS_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "TICKETS"];

export const SET_EVENT_ADD_ON_TICKETS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnTickets>>
) => {
  client.setQueryData(EVENT_ADD_ON_TICKETS_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnTicketsProps extends InfiniteQueryParams {
  eventId: string;
  addOnId: string;
}

export const GetEventAddOnTickets = async ({
  eventId,
  addOnId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventAddOnTicketsProps): Promise<ConnectedXMResponse<Ticket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/tickets`,
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

const useGetEventAddOnTickets = (eventId: string, addOnId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnTickets>>
  >(
    EVENT_ADD_ON_TICKETS_QUERY_KEY(eventId, addOnId),
    (params: InfiniteQueryParams) => GetEventAddOnTickets(params),
    {
      eventId,
      addOnId,
    },
    {
      enabled: !!eventId && !!addOnId,
    }
  );
};

export default useGetEventAddOnTickets;
