import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_COUPON_QUERY_KEY } from "./useGetEventCoupon";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_COUPON_KPI_DISCOUNTS_QUERY_KEY = (
  eventId: string,
  couponId: string
) => [...EVENT_COUPON_QUERY_KEY(eventId, couponId), "KPI_DISCOUNTS"];

export const SET_EVENT_COUPON_KPI_DISCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPON_KPI_DISCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCouponKPIDiscounts>>
) => {
  client.setQueryData(
    EVENT_COUPON_KPI_DISCOUNTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventCouponKPIDiscountsProps {
  eventId: string;
  couponId: string;
}

interface DiscountResponse {
  status: "ok" | "error";
  message: string;
  sum: number;
  data: {
    day: string;
    sum: number;
  }[];
}

export const GetEventCouponKPIDiscounts = async ({
  eventId,
  couponId,
}: GetEventCouponKPIDiscountsProps): Promise<
  ConnectedXMResponse<DiscountResponse>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/coupons/${couponId}/kpi/discounts`
  );
  return data;
};

const useGetEventCouponKPIDiscounts = (eventId: string, couponId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventCouponKPIDiscounts>>((
    EVENT_COUPON_KPI_DISCOUNTS_QUERY_KEY(eventId, couponId),
    () => GetEventCouponKPIDiscounts({ eventId, couponId }),
    {
      enabled: !!eventId && !!couponId,
    }
  );
};

export default useGetEventCouponKPIDiscounts;
