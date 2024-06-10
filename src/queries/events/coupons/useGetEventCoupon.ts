import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import { EVENT_COUPONS_QUERY_KEY } from "./useGetEventCoupons";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_COUPON_QUERY_KEY = (eventId: string, couponId: string) => [
  ...EVENT_COUPONS_QUERY_KEY(eventId),
  couponId,
];

export const SET_EVENT_COUPON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCoupon>>
) => {
  client.setQueryData(EVENT_COUPON_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponProps {
  eventId: string;
  couponId: string;
}

export const GetEventCoupon = async ({
  eventId,
  couponId,
}: GetEventCouponProps): Promise<ConnectedXMResponse<Coupon>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/coupons/${couponId}`);
  return data;
};

const useGetEventCoupon = (eventId: string, couponId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventCoupon>>(
    EVENT_COUPON_QUERY_KEY(eventId, couponId),
    () => GetEventCoupon({ eventId, couponId: couponId || "unknown" }),
    {
      enabled: !!eventId && !!couponId,
    }
  );
};

export default useGetEventCoupon;
