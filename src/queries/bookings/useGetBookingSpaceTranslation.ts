import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingSpaceTranslation, ConnectedXMResponse } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_SPACE_TRANSLATIONS_QUERY_KEY } from "./useGetBookingSpaceTranslations";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_TRANSLATION_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string,
  locale: string
) => [
  ...BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(bookingPlaceId, bookingSpaceId),
  locale,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BOOKING_SPACE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpaceTranslation>>
) => {
  client.setQueryData(
    BOOKING_SPACE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSpaceTranslationProps extends SingleQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetEventSpaceTranslation = async ({
  bookingPlaceId,
  bookingSpaceId,
  locale,
  adminApiParams,
}: GetEventSpaceTranslationProps): Promise<
  ConnectedXMResponse<BookingSpaceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetEventSpaceTranslation = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSpaceTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSpaceTranslation>>(
    BOOKING_SPACE_TRANSLATION_QUERY_KEY(bookingPlaceId, bookingSpaceId, locale),
    (params: SingleQueryParams) =>
      GetEventSpaceTranslation({
        bookingPlaceId,
        bookingSpaceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!bookingPlaceId &&
        !!bookingSpaceId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
