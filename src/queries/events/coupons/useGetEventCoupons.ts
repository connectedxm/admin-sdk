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
 * @category Keys
 * @group Events
 */
export const EVENT_COUPONS_QUERY_KEY = (eventId: string, prePaid?: boolean) => {
  const key = [...EVENT_QUERY_KEY(eventId), "COUPONS"];
  if (typeof prePaid === "boolean") {
    key.push(prePaid ? "GROUP" : "STANDARD");
  }
  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_COUPONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCoupons>>
) => {
  client.setQueryData(EVENT_COUPONS_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponsProps extends InfiniteQueryParams {
  eventId: string;
  prePaid?: boolean;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventCoupons = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
  prePaid,
}: GetEventCouponsProps): Promise<ConnectedXMResponse<Coupon[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/coupons`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      prePaid:
        typeof prePaid === "boolean" ? (prePaid ? "true" : "false") : undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventCoupons = (
  eventId: string = "",
  prePaid?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventCoupons>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventCoupons>>>(
    EVENT_COUPONS_QUERY_KEY(eventId, prePaid),
    (params: InfiniteQueryParams) =>
      GetEventCoupons({
        ...params,
        eventId,
        prePaid,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
