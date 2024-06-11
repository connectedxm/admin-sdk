import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TICKET_COUPONS_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "COUPONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TICKET_COUPONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKET_COUPONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketCoupons>>
) => {
  client.setQueryData(EVENT_TICKET_COUPONS_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketCouponsProps extends InfiniteQueryParams {
  eventId: string;
  ticketId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTicketCoupons = async ({
  eventId,
  ticketId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventTicketCouponsProps): Promise<ConnectedXMResponse<Coupon[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/coupons`,
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
export const useGetEventTicketCoupons = (
  eventId: string = "",
  ticketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTicketCoupons>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketCoupons>>
  >(
    EVENT_TICKET_COUPONS_QUERY_KEY(eventId, ticketId),
    (params: InfiniteQueryParams) =>
      GetEventTicketCoupons({
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
