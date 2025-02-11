import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BookingPlaceTranslation, ConnectedXMResponse } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_PLACE_TRANSLATIONS_QUERY_KEY } from "./useGetBookingPlaceTranslations";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_PLACE_TRANSLATION_QUERY_KEY = (
  bookingPlaceId: string,
  locale: string
) => [...BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(bookingPlaceId), locale];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_PLACE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BOOKING_PLACE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlaceTranslation>>
) => {
  client.setQueryData(
    BOOKING_PLACE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingPlaceTranslationProps extends SingleQueryParams {
  bookingPlaceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlaceTranslation = async ({
  bookingPlaceId,
  locale,
  adminApiParams,
}: GetBookingPlaceTranslationProps): Promise<
  ConnectedXMResponse<BookingPlaceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingPlaceTranslation = (
  bookingPlaceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingPlaceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlaceTranslation>>(
    BOOKING_PLACE_TRANSLATION_QUERY_KEY(bookingPlaceId, locale),
    (params: SingleQueryParams) =>
      GetBookingPlaceTranslation({
        bookingPlaceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!bookingPlaceId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
