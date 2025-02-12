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
  placeId: string,
  locale: string
) => [...BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(placeId), locale];

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
  placeId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingPlaceTranslation = async ({
  placeId,
  locale,
  adminApiParams,
}: GetBookingPlaceTranslationProps): Promise<
  ConnectedXMResponse<BookingPlaceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingPlaceTranslation = (
  placeId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingPlaceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlaceTranslation>>(
    BOOKING_PLACE_TRANSLATION_QUERY_KEY(placeId, locale),
    (params: SingleQueryParams) =>
      GetBookingPlaceTranslation({
        placeId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId && !!locale && locale !== "en" && (options?.enabled ?? true),
    },
    "bookings"
  );
};
