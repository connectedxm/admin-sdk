import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpace, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACES_QUERY_KEY } from "./useGetBookingSpaces";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUERY_KEY = (placeId: string, spaceId: string) => [
  ...BOOKING_SPACES_QUERY_KEY(placeId),
  spaceId,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpace>>
) => {
  client.setQueryData(BOOKING_SPACE_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpace = async ({
  placeId,
  spaceId,
  adminApiParams,
}: GetBookingSpaceProps): Promise<ConnectedXMResponse<BookingSpace>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpace = (
  placeId: string = "",
  spaceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpace>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpace>>(
    BOOKING_SPACE_QUERY_KEY(placeId, spaceId),
    (params: SingleQueryParams) =>
      GetBookingSpace({ placeId, spaceId, ...params }),
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
