import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpaceAvailability, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_AVAILABILITIES_QUERY_KEY = (
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
export const SET_BOOKING_SPACE_AVAILABILITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_AVAILABILITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceAvailabilities>>
) => {
  client.setQueryData(
    BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceAvailabilitiesProps extends SingleQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceAvailabilities = async ({
  bookingPlaceId,
  bookingSpaceId,
  adminApiParams,
}: GetBookingSpaceAvailabilitiesProps): Promise<
  ConnectedXMResponse<BookingSpaceAvailability[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/availabilities`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceAvailabilities = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceAvailabilities>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceAvailabilities>
  >(
    BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(bookingPlaceId, bookingSpaceId),
    (params: SingleQueryParams) =>
      GetBookingSpaceAvailabilities({
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
