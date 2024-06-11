import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Registration } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_COUPON_QUERY_KEY } from "./useGetEventCoupon";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_COUPON_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  couponId: string
) => [...EVENT_COUPON_QUERY_KEY(eventId, couponId), "REGISTRATIONS"];

export const SET_EVENT_COUPON_REGISTRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPON_REGISTRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCouponRegistrations>>
) => {
  client.setQueryData(
    EVENT_COUPON_REGISTRATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventCouponRegistrationsProps extends InfiniteQueryParams {
  eventId: string;
  couponId: string;
}

export const GetEventCouponRegistrations = async ({
  eventId,
  couponId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventCouponRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/coupons/${couponId}/registrations`,
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

const useGetEventCouponRegistrations = (eventId: string, couponId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventCouponRegistrations>>
  >(
    EVENT_COUPON_REGISTRATIONS_QUERY_KEY(eventId, couponId),
    (params: InfiniteQueryParams) => GetEventCouponRegistrations(params),
    {
      eventId,
      couponId,
    },
    {}
  );
};

export default useGetEventCouponRegistrations;
