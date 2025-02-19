import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { BOOKING_QUERY_KEY } from "./useGetBooking";
import { Payment } from "@src/interfaces";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_PAYMENTS_QUERY_KEY = (bookingId: string) => [
  ...BOOKING_QUERY_KEY(bookingId),
  "PAYMENTS",
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPayments>>
) => {
  client.setQueryData(BOOKING_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetBookingPaymentsProps extends InfiniteQueryParams {
  bookingId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPayments = async ({
  bookingId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/${bookingId}/payments`, {
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
export const useGetBookingPayments = (
  bookingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPayments>>
  >(
    BOOKING_PAYMENTS_QUERY_KEY(bookingId),
    (params: InfiniteQueryParams) =>
      GetBookingPayments({
        ...params,
        bookingId,
      }),
    params,
    {
      ...options,
      enabled: !!bookingId && (options.enabled ?? true),
    },
    "bookings"
  );
};
