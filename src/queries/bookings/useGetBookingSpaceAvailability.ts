import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpaceAvailability, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_AVAILABILITIES_QUERY_KEY } from "./useGetBookingSpaceAvailabilities";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_AVAILABILITY_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string,
  availabilityId: string
) => [
  ...BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(bookingPlaceId, availabilityId),
  bookingSpaceId,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_AVAILABILITY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_AVAILABILITY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceAvailability>>
) => {
  client.setQueryData(
    BOOKING_SPACE_AVAILABILITY_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceAvailabilityProps extends SingleQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
  availabilityId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceAvailability = async ({
  bookingPlaceId,
  bookingSpaceId,
  availabilityId,
  adminApiParams,
}: GetBookingSpaceAvailabilityProps): Promise<
  ConnectedXMResponse<BookingSpaceAvailability>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/blackouts/${availabilityId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceAvailability = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  availabilityId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceAvailability>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceAvailability>
  >(
    BOOKING_SPACE_AVAILABILITY_QUERY_KEY(
      bookingPlaceId,
      bookingSpaceId,
      availabilityId
    ),
    (params: SingleQueryParams) =>
      GetBookingSpaceAvailability({
        bookingPlaceId,
        bookingSpaceId,
        availabilityId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!bookingPlaceId &&
        !!bookingSpaceId &&
        !!availabilityId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
