import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceBlackout, ConnectedXMResponse } from "@src/interfaces";

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
export const BOOKING_SPACE_BLACKOUTS_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  past?: boolean
) => {
  const keys = [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "BLACKOUTS"];
  if (typeof past === "boolean") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  return keys;
};

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_BLACKOUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_BLACKOUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceBlackouts>>
) => {
  client.setQueryData(
    BOOKING_SPACE_BLACKOUTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceBlackoutsProps extends InfiniteQueryParams {
  placeId: string;
  spaceId: string;
  past?: boolean;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceBlackouts = async ({
  placeId,
  spaceId,
  past,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpaceBlackoutsProps): Promise<
  ConnectedXMResponse<BookingSpaceBlackout[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/blackouts`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        past: typeof past === "boolean" ? past : undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceBlackouts = (
  placeId: string = "",
  spaceId: string = "",
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaceBlackouts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaceBlackouts>>
  >(
    BOOKING_SPACE_BLACKOUTS_QUERY_KEY(placeId, spaceId, past),
    (params: InfiniteQueryParams) =>
      GetBookingSpaceBlackouts({
        placeId,
        spaceId,
        past,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    }
  );
};
