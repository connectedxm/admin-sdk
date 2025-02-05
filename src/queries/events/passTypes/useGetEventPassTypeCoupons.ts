import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "./useGetEventPassType";

/**
 * Fetches coupons associated with a specific event pass type.
 * This function retrieves a list of coupons linked to a particular event pass type, 
 * allowing users to manage and view available discounts or offers for event attendees.
 * It is designed to be used in applications that require detailed coupon information 
 * for event management and promotion purposes.
 * @name GetEventPassTypeCoupons
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @version 1.2
 **/

export const EVENT_PASS_TYPE_COUPONS_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "COUPONS"];

export const SET_PASS_TYPE_COUPONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_COUPONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof EventGetPassTypeCoupons>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_COUPONS_QUERY_KEY(...keyParams),
    response
  );
};

interface EventGetPassTypeCouponsProps extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
}

export const EventGetPassTypeCoupons = async ({
  eventId,
  passTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: EventGetPassTypeCouponsProps): Promise<ConnectedXMResponse<Coupon[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/coupons`,
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

export const useEventGetPassTypeCoupons = (
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof EventGetPassTypeCoupons>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof EventGetPassTypeCoupons>>
  >(
    EVENT_PASS_TYPE_COUPONS_QUERY_KEY(eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      EventGetPassTypeCoupons({
        ...params,
        eventId,
        passTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passTypeId && (options.enabled ?? true),
    },
    "events"
  );
};