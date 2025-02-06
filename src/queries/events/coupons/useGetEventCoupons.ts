import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve and manage coupons associated with a specific event.
 * This function provides the ability to fetch a list of coupons for a given event, 
 * supporting pagination and other query parameters for refined data retrieval.
 * It is designed for use in applications that require detailed coupon information 
 * for events, facilitating operations such as listing and managing event-specific coupons.
 * @name GetEventCoupons
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export const EVENT_COUPONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "COUPONS",
];

export const SET_EVENT_COUPONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCoupons>>
) => {
  client.setQueryData(EVENT_COUPONS_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventCoupons = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventCouponsProps): Promise<ConnectedXMResponse<Coupon[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/coupons`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventCoupons = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventCoupons>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventCoupons>>>(
    EVENT_COUPONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventCoupons({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};