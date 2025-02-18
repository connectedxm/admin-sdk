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
export const BOOKING_PLACE_QUERY_KEY = (placeId: string) => [
  ...BOOKING_PLACES_QUERY_KEY(),
  placeId,
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
  placeId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlace = async ({
  placeId,
  adminApiParams,
}: GetBookingPlaceProps): Promise<ConnectedXMResponse<BookingPlace>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/places/${placeId}`);
  return data;
};
/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingPlace = (
  placeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingPlace>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlace>>(
    BOOKING_PLACE_QUERY_KEY(placeId),
    (params: SingleQueryParams) => GetBookingPlace({ placeId, ...params }),
    {
      ...options,
      enabled: !!placeId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
