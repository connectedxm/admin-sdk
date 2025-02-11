import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_COUPON_QUERY_KEY } from "./useGetEventCoupon";

/**
 * Fetches a list of event coupon passes for a specific event and coupon.
 * This function retrieves data about passes associated with a given event and coupon,
 * allowing applications to display or process this information as needed.
 * @name GetEventCouponPasses
 * @param {string} eventId (path) The id of the event
 * @param {string} couponId (path) The id of the coupon
 * @version 1.3
 **/

export const EVENT_COUPON_PASSES_QUERY_KEY = (
  eventId: string,
  couponId: string
) => [...EVENT_COUPON_QUERY_KEY(eventId, couponId), "PASSES"];

export const SET_EVENT_COUPON_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPON_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCouponPasses>>
) => {
  client.setQueryData(EVENT_COUPON_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponPassesProps extends InfiniteQueryParams {
  eventId: string;
  couponId: string;
}

export const GetEventCouponPasses = async ({
  eventId,
  couponId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventCouponPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/coupons/${couponId}/passes`,
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

export const useGetEventCouponPasses = (
  eventId: string = "",
  couponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventCouponPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventCouponPasses>>
  >(
    EVENT_COUPON_PASSES_QUERY_KEY(eventId, couponId),
    (params: InfiniteQueryParams) =>
      GetEventCouponPasses({
        ...params,
        eventId,
        couponId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!couponId && (options.enabled ?? true),
    },
    "events"
  );
};
