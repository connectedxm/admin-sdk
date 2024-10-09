import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTENDEE_QUERY_KEY } from "./useGetEventAttendee";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_COUPONS_QUERY_KEY = (
  eventId: string,
  attendeeId: string,
  prePaid?: boolean
) => {
  const key = [...EVENT_ATTENDEE_QUERY_KEY(eventId, attendeeId), "COUPONS"];

  if (typeof prePaid === "boolean") {
    key.push(prePaid.toString());
  }

  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_REGISTRATION_COUPONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_COUPONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeeCoupons>>
) => {
  client.setQueryData(EVENT_ATTENDEE_COUPONS_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeeCouponsProps extends InfiniteQueryParams {
  eventId: string;
  attendeeId: string;
  prePaid?: boolean;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeeCoupons = async ({
  eventId,
  attendeeId,
  prePaid,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeeCouponsProps): Promise<ConnectedXMResponse<Coupon[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${attendeeId}/coupons`,
    {
      params: {
        paid: typeof prePaid === "boolean" ? prePaid : undefined,
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
export const useGetEventAttendeeCoupons = (
  eventId: string = "",
  attendeeId: string = "",
  prePaid?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeCoupons>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeCoupons>>
  >(
    EVENT_ATTENDEE_COUPONS_QUERY_KEY(eventId, attendeeId, prePaid),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeCoupons({
        ...params,
        eventId,
        attendeeId,
        prePaid,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!attendeeId && (options.enabled ?? true),
    },
    "events"
  );
};
