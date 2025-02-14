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
  placeId: string,
  spaceId: string
) => [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "AVAILABILITIES"];

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
  placeId: string;
  spaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceAvailabilities = async ({
  placeId,
  spaceId,
  adminApiParams,
}: GetBookingSpaceAvailabilitiesProps): Promise<
  ConnectedXMResponse<BookingSpaceAvailability[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/availabilities`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceAvailabilities = (
  placeId: string = "",
  spaceId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceAvailabilities>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceAvailabilities>
  >(
    BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(placeId, spaceId),
    (params: SingleQueryParams) =>
      GetBookingSpaceAvailabilities({
        placeId,
        spaceId,
        ...params,
      }),
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
