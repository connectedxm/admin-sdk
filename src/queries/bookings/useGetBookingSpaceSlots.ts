import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSlot, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_SLOTS_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  firstDayOfMonth: string
) => [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "SLOTS", firstDayOfMonth];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_SLOTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_SLOTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceSlots>>
) => {
  client.setQueryData(BOOKING_SPACE_SLOTS_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceSlotsProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  firstDayOfMonth: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceSlots = async ({
  placeId,
  spaceId,
  firstDayOfMonth,
  adminApiParams,
}: GetBookingSpaceSlotsProps): Promise<
  ConnectedXMResponse<{ day: string; slots: BookingSlot[] }[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/slots`,
    {
      params: {
        firstDayOfMonth,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceSlots = (
  placeId: string = "",
  spaceId: string = "",
  firstDayOfMonth: string,
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpaceSlots>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceSlots>>(
    BOOKING_SPACE_SLOTS_QUERY_KEY(placeId, spaceId, firstDayOfMonth),
    (params: SingleQueryParams) =>
      GetBookingSpaceSlots({
        placeId,
        spaceId,
        firstDayOfMonth,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId &&
        !!spaceId &&
        !!firstDayOfMonth &&
        (options?.enabled ?? true),
    },
    "bookings"
  );
};
