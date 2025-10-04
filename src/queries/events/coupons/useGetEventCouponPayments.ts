import { ConnectedXMResponse } from "@src/interfaces";
import { Payment } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_COUPON_QUERY_KEY } from "./useGetEventCoupon";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_COUPON_PAYMENTS_QUERY_KEY = (
  eventId: string,
  couponId: string
) => [...EVENT_COUPON_QUERY_KEY(eventId, couponId), "PAYMENTS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_COUPON_PAYMENTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_COUPON_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCouponPayments>>
) => {
  client.setQueryData(EVENT_COUPON_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponPaymentsProps extends InfiniteQueryParams {
  eventId: string;
  couponId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventCouponPayments = async ({
  eventId,
  couponId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventCouponPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/coupons/${couponId}/payments`,
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
export const useGetEventCouponPayments = (
  eventId: string = "",
  couponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventCouponPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventCouponPayments>>
  >(
    EVENT_COUPON_PAYMENTS_QUERY_KEY(eventId, couponId),
    (params: InfiniteQueryParams) =>
      GetEventCouponPayments({
        ...params,
        eventId,
        couponId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!couponId && (options.enabled ?? true),
    }
  );
};
