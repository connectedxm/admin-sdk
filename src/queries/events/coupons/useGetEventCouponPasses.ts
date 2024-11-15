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
 * @category Keys
 * @group Events
 */
export const EVENT_COUPON_PASSES_QUERY_KEY = (
  eventId: string,
  couponId: string
) => [...EVENT_COUPON_QUERY_KEY(eventId, couponId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
