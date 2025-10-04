import { GetAdminAPI } from "@src/AdminAPI";
import { Booking, ConnectedXMResponse, PurchaseStatus } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_BOOKINGS_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  past?: boolean,
  status?: PurchaseStatus
) => {
  const keys = [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "BOOKINGS"];
  if (typeof past === "boolean") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  if (status) keys.push(status);

  return keys;
};

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_BOOKINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_BOOKINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceBookings>>
) => {
  client.setQueryData(BOOKING_SPACE_BOOKINGS_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceBookingsProps extends InfiniteQueryParams {
  placeId: string;
  spaceId: string;
  past?: boolean;
  status?: PurchaseStatus;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceBookings = async ({
  placeId,
  spaceId,
  status,
  past,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpaceBookingsProps): Promise<ConnectedXMResponse<Booking[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/bookings`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        past: typeof past === "boolean" ? past : undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceBookings = (
  placeId: string = "",
  spaceId: string = "",
  past?: boolean,
  status?: PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaceBookings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaceBookings>>
  >(
    BOOKING_SPACE_BOOKINGS_QUERY_KEY(placeId, spaceId, past, status),
    (params: InfiniteQueryParams) =>
      GetBookingSpaceBookings({
        placeId,
        spaceId,
        past,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    }
  );
};
