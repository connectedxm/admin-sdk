import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpace, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACES_QUERY_KEY } from "./useGetBookingSpaces";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string
) => [...BOOKING_SPACES_QUERY_KEY(bookingPlaceId), bookingSpaceId];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpace>>
) => {
  client.setQueryData(BOOKING_SPACE_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceProps extends SingleQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpace = async ({
  bookingPlaceId,
  bookingSpaceId,
  adminApiParams,
}: GetBookingSpaceProps): Promise<ConnectedXMResponse<BookingSpace>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpace = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpace>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpace>>(
    BOOKING_SPACE_QUERY_KEY(bookingPlaceId, bookingSpaceId),
    (params: SingleQueryParams) =>
      GetBookingSpace({ bookingPlaceId, bookingSpaceId, ...params }),
    {
      ...options,
      enabled:
        !!bookingPlaceId && !!bookingSpaceId && (options?.enabled ?? true),
    },
    "events"
  );
};
