import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { Booking, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_QUERY_KEY = (bookingId: string) => ["BOOKINGS", bookingId];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBooking>>
) => {
  client.setQueryData(BOOKING_QUERY_KEY(...keyParams), response);
};

interface GetBookingProps extends SingleQueryParams {
  bookingId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBooking = async ({
  bookingId,
  adminApiParams,
}: GetBookingProps): Promise<ConnectedXMResponse<Booking>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/${bookingId}`);
  return data;
};
/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBooking = (
  bookingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBooking>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBooking>>(
    BOOKING_QUERY_KEY(bookingId),
    (params: SingleQueryParams) => GetBooking({ bookingId, ...params }),
    {
      ...options,
      enabled: !!bookingId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
