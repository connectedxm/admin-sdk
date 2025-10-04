import { GetAdminAPI } from "@src/AdminAPI";
import { Booking, ConnectedXMResponse, PurchaseStatus } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";
import { BOOKING_PLACE_QUERY_KEY } from "./useGetBookingPlace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_PLACE_BOOKINGS_QUERY_KEY = (
  placeId: string,
  past?: boolean,
  status?: PurchaseStatus
) => {
  const keys = [...BOOKING_PLACE_QUERY_KEY(placeId), "BOOKINGS"];
  if (typeof past === "boolean") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  if (status) keys.push(status);
  return keys;
};

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_PLACE_BOOKINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACE_BOOKINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlaceBookings>>
) => {
  client.setQueryData(BOOKING_PLACE_BOOKINGS_QUERY_KEY(...keyParams), response);
};

interface GetBookingPlaceBookingsProps extends InfiniteQueryParams {
  placeId: string;
  past?: boolean;
  status?: PurchaseStatus;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlaceBookings = async ({
  placeId,
  past,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingPlaceBookingsProps): Promise<ConnectedXMResponse<Booking[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/places/${placeId}/bookings`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: typeof past === "boolean" ? past : undefined,
      status: status || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingPlaceBookings = (
  placeId: string = "",
  past?: boolean,
  status?: PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPlaceBookings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPlaceBookings>>
  >(
    BOOKING_PLACE_BOOKINGS_QUERY_KEY(placeId, past, status),
    (params: InfiniteQueryParams) =>
      GetBookingPlaceBookings({
        placeId,
        past,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && (options?.enabled ?? true),
    }
  );
};
