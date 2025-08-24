import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";

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
export const BOOKING_PLACE_PAYMENTS_QUERY_KEY = (placeId: string) => {
  const keys = [...BOOKING_PLACE_QUERY_KEY(placeId), "PAYMENTS"];
  return keys;
};

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_PLACE_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACE_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlacePayments>>
) => {
  client.setQueryData(BOOKING_PLACE_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetBookingPlacePaymentsProps extends InfiniteQueryParams {
  placeId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlacePayments = async ({
  placeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingPlacePaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/places/${placeId}/payments`, {
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
export const useGetBookingPlacePayments = (
  placeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPlacePayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPlacePayments>>
  >(
    BOOKING_PLACE_PAYMENTS_QUERY_KEY(placeId),
    (params: InfiniteQueryParams) =>
      GetBookingPlacePayments({
        placeId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
