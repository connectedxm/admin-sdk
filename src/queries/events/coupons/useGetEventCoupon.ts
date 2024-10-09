import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import { EVENT_COUPONS_QUERY_KEY } from "./useGetEventCoupons";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_COUPON_QUERY_KEY = (eventId: string, couponId: string) => [
  ...EVENT_COUPONS_QUERY_KEY(eventId),
  couponId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_COUPON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCoupon>>
) => {
  client.setQueryData(EVENT_COUPON_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponProps extends SingleQueryParams {
  eventId: string;
  couponId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventCoupon = async ({
  eventId,
  couponId,
  adminApiParams,
}: GetEventCouponProps): Promise<ConnectedXMResponse<Coupon>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/coupons/${couponId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventCoupon = (
  eventId: string = "",
  couponId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventCoupon>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventCoupon>>(
    EVENT_COUPON_QUERY_KEY(eventId, couponId),
    (params: SingleQueryParams) =>
      GetEventCoupon({ eventId, couponId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!couponId && (options?.enabled ?? true),
    },
    "events"
  );
};
