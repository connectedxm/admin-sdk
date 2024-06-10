import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Coupon } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

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

const useGetEventCoupons = (eventId: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventCoupons>>(
    EVENT_COUPONS_QUERY_KEY(eventId),
    (params: any) => GetEventCoupons(params),
    {
      eventId,
    },
    {}
  );
};

export default useGetEventCoupons;
