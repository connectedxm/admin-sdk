import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpace, ConnectedXMResponse } from "@src/interfaces";

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
export const BOOKING_SPACES_QUERY_KEY = (placeId: string) => [
  ...BOOKING_PLACE_QUERY_KEY(placeId),
  "BOOKING_SPACES",
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaces>>
) => {
  client.setQueryData(BOOKING_SPACES_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpacesProps extends InfiniteQueryParams {
  placeId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaces = async ({
  placeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpacesProps): Promise<ConnectedXMResponse<BookingSpace[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/places/${placeId}/spaces`, {
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
export const useGetBookingSpaces = (
  placeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaces>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaces>>
  >(
    BOOKING_SPACES_QUERY_KEY(placeId),
    (params: InfiniteQueryParams) => GetBookingSpaces({ placeId, ...params }),
    params,
    {
      ...options,
      enabled: !!placeId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
