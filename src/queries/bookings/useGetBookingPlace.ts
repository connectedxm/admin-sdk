import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingPlace, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_PLACES_QUERY_KEY } from "./useGetBookingPlaces";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_PLACE_QUERY_KEY = (bookingPlaceId: string) => [
  ...BOOKING_PLACES_QUERY_KEY(),
  bookingPlaceId,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_PLACE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlace>>
) => {
  client.setQueryData(BOOKING_PLACE_QUERY_KEY(...keyParams), response);
};

interface GetBookingPlaceProps extends SingleQueryParams {
  bookingPlaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlace = async ({
  bookingPlaceId,
  adminApiParams,
}: GetBookingPlaceProps): Promise<ConnectedXMResponse<BookingPlace>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookingPlaces/${bookingPlaceId}`);
  return data;
};
/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingPlace = (
  bookingPlaceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingPlace>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlace>>(
    BOOKING_PLACE_QUERY_KEY(bookingPlaceId),
    (params: SingleQueryParams) =>
      GetBookingPlace({ bookingPlaceId, ...params }),
    {
      ...options,
      enabled: !!bookingPlaceId && (options?.enabled ?? true),
    },
    "events"
  );
};
