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
export const EVENT_COUPON_VARIANTS_QUERY_KEY = (
  eventId: string,
  parentCouponId: string
) => {
  const key = [...EVENT_QUERY_KEY(eventId), "COUPONS"];
  key.push("VARIANTS", parentCouponId);
  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_COUPON_VARIANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_COUPON_VARIANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCouponVariants>>
) => {
  client.setQueryData(EVENT_COUPON_VARIANTS_QUERY_KEY(...keyParams), response);
};

interface GetEventCouponVariantsProps extends InfiniteQueryParams {
  eventId: string;
  parentCouponId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventCouponVariants = async ({
  eventId,
  parentCouponId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventCouponVariantsProps): Promise<ConnectedXMResponse<Coupon[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/coupons/${parentCouponId}/variants`,
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
export const useGetEventCouponVariants = (
  eventId: string = "",
  parentCouponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventCouponVariants>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventCouponVariants>>
  >(
    EVENT_COUPON_VARIANTS_QUERY_KEY(eventId, parentCouponId),
    (params: InfiniteQueryParams) =>
      GetEventCouponVariants({
        ...params,
        eventId,
        parentCouponId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!parentCouponId && (options.enabled ?? true),
    }
  );
};
