import { ConnectedXMResponse } from "@src/interfaces";
import { EventTicket } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "./useGetEventAddOn";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_TICKETS_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "TICKETS"];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOnTickets = async ({
  eventId,
  addOnId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAddOnTicketsProps): Promise<ConnectedXMResponse<EventTicket[]>> => {
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
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAddOnTickets = (
  eventId: string = "",
  addOnId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAddOnTickets>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnTickets>>
  >(
    EVENT_ADD_ON_TICKETS_QUERY_KEY(eventId, addOnId),
    (params: InfiniteQueryParams) =>
      GetEventAddOnTickets({
        ...params,
        eventId,
        addOnId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!addOnId && (options.enabled ?? true),
    }
  );
};
