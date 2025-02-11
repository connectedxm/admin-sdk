import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSlot, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_SLOTS_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string
) => [
  ...BOOKING_SPACE_QUERY_KEY(bookingPlaceId, bookingSpaceId),
  bookingSpaceId,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_SLOTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_SLOTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceSlots>>
) => {
  client.setQueryData(BOOKING_SPACE_SLOTS_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceSlotsProps extends SingleQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceSlots = async ({
  bookingPlaceId,
  bookingSpaceId,
  adminApiParams,
}: GetBookingSpaceSlotsProps): Promise<ConnectedXMResponse<BookingSlot[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/slots`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceSlots = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpaceSlots>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceSlots>>(
    BOOKING_SPACE_SLOTS_QUERY_KEY(bookingPlaceId, bookingSpaceId),
    (params: SingleQueryParams) =>
      GetBookingSpaceSlots({
        bookingPlaceId,
        bookingSpaceId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!bookingPlaceId && !!bookingSpaceId && (options?.enabled ?? true),
    },
    "events"
  );
};
