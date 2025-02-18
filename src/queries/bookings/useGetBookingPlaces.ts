import { GetAdminAPI } from "@src/AdminAPI";
import { BookingPlace, ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_PLACES_QUERY_KEY = () => ["BOOKING_PLACES"];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_PLACES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlaces>>
) => {
  client.setQueryData(BOOKING_PLACES_QUERY_KEY(...keyParams), response);
};

interface GetBookingPlacesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlaces = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingPlacesProps): Promise<ConnectedXMResponse<BookingPlace[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/places`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingPlaces = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPlaces>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPlaces>>
  >(
    BOOKING_PLACES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetBookingPlaces({ ...params }),
    params,
    options,
    "bookings"
  );
};
