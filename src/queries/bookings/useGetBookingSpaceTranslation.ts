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
  placeId: string,
  spaceId: string,
  locale: string
) => [...BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(placeId, spaceId), locale];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BOOKING_SPACE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceTranslation>>
) => {
  client.setQueryData(
    BOOKING_SPACE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceTranslationProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceTranslation = async ({
  placeId,
  spaceId,
  locale,
  adminApiParams,
}: GetBookingSpaceTranslationProps): Promise<
  ConnectedXMResponse<BookingSpaceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceTranslation = (
  placeId: string = "",
  spaceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceTranslation>>(
    BOOKING_SPACE_TRANSLATION_QUERY_KEY(placeId, spaceId, locale),
    (params: SingleQueryParams) =>
      GetBookingSpaceTranslation({
        placeId,
        spaceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId &&
        !!spaceId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "bookings"
  );
};
