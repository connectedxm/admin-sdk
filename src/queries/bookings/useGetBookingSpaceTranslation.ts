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
  response: Awaited<ReturnType<typeof GetEventSpaceTranslation>>
) => {
  client.setQueryData(
    BOOKING_SPACE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSpaceTranslationProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetEventSpaceTranslation = async ({
  placeId,
  spaceId,
  locale,
  adminApiParams,
}: GetEventSpaceTranslationProps): Promise<
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
export const useGetEventSpaceTranslation = (
  placeId: string = "",
  spaceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSpaceTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSpaceTranslation>>(
    BOOKING_SPACE_TRANSLATION_QUERY_KEY(placeId, spaceId, locale),
    (params: SingleQueryParams) =>
      GetEventSpaceTranslation({
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
