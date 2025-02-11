import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpaceBlackout, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_BLACKOUTS_QUERY_KEY } from "./useGetBookingSpaceBlackouts";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_BLACKOUT_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string,
  blackoutId: string
) => [
  ...BOOKING_SPACE_BLACKOUTS_QUERY_KEY(bookingPlaceId, blackoutId),
  bookingSpaceId,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_BLACKOUT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceBlackout>>
) => {
  client.setQueryData(BOOKING_SPACE_BLACKOUT_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceBlackoutProps extends SingleQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
  blackoutId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceBlackout = async ({
  bookingPlaceId,
  bookingSpaceId,
  blackoutId,
  adminApiParams,
}: GetBookingSpaceBlackoutProps): Promise<
  ConnectedXMResponse<BookingSpaceBlackout>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/blackouts/${blackoutId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceBlackout = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  blackoutId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpaceBlackout>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceBlackout>>(
    BOOKING_SPACE_BLACKOUT_QUERY_KEY(
      bookingPlaceId,
      bookingSpaceId,
      blackoutId
    ),
    (params: SingleQueryParams) =>
      GetBookingSpaceBlackout({
        bookingPlaceId,
        bookingSpaceId,
        blackoutId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!bookingPlaceId &&
        !!bookingSpaceId &&
        !!blackoutId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
