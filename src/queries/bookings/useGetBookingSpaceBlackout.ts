import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpaceBlackout, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_BLACKOUTS_QUERY_KEY } from "./useGetBookingSpaceBlackouts";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_BLACKOUT_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  blackoutId: string
) => [...BOOKING_SPACE_BLACKOUTS_QUERY_KEY(placeId, spaceId), blackoutId];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_BLACKOUT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceBlackout>>
) => {
  client.setQueryData(BOOKING_SPACE_BLACKOUT_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceBlackoutProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  blackoutId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceBlackout = async ({
  placeId,
  spaceId,
  blackoutId,
  adminApiParams,
}: GetBookingSpaceBlackoutProps): Promise<
  ConnectedXMResponse<BookingSpaceBlackout>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/blackouts/${blackoutId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceBlackout = (
  placeId: string = "",
  spaceId: string = "",
  blackoutId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpaceBlackout>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceBlackout>>(
    BOOKING_SPACE_BLACKOUT_QUERY_KEY(placeId, spaceId, blackoutId),
    (params: SingleQueryParams) =>
      GetBookingSpaceBlackout({
        placeId,
        spaceId,
        blackoutId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId && !!spaceId && !!blackoutId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
