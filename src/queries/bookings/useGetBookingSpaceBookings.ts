import { GetAdminAPI } from "@src/AdminAPI";
import { Booking, ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_BOOKINGS_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string
) => [...BOOKING_SPACE_QUERY_KEY(bookingPlaceId, bookingSpaceId), "BOOKINGS"];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_BOOKINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_BOOKINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceBookings>>
) => {
  client.setQueryData(BOOKING_SPACE_BOOKINGS_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceBookingsProps extends InfiniteQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceBookings = async ({
  bookingPlaceId,
  bookingSpaceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpaceBookingsProps): Promise<ConnectedXMResponse<Booking[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/bookings`,
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
 * @group Bookings
 */
export const useGetBookingSpaceBookings = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaceBookings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaceBookings>>
  >(
    BOOKING_SPACE_BOOKINGS_QUERY_KEY(bookingPlaceId, bookingSpaceId),
    (params: InfiniteQueryParams) =>
      GetBookingSpaceBookings({ bookingPlaceId, bookingSpaceId, ...params }),
    params,
    {
      ...options,
      enabled:
        !!bookingPlaceId && !!bookingSpaceId && (options?.enabled ?? true),
    },
    "events"
  );
};
