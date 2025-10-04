import { ISupportedLocale } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingPlaceTranslationUpdateInputs } from "@src/params";
import {
  BOOKING_PLACE_TRANSLATIONS_QUERY_KEY,
  SET_BOOKING_PLACE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingPlaceTranslationParams extends MutationParams {
  placeId: string;
  locale: ISupportedLocale;
  bookingPlaceTranslation: BookingPlaceTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingPlaceTranslation = async ({
  placeId,
  bookingPlaceTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateBookingPlaceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/bookings/places/${placeId}/translations/${locale}`,
    bookingPlaceTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(placeId),
    });
    SET_BOOKING_PLACE_TRANSLATION_QUERY_DATA(
      queryClient,
      [placeId, data?.data?.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingPlaceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingPlaceTranslation>>,
      Omit<
        UpdateBookingPlaceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingPlaceTranslationParams,
    Awaited<ReturnType<typeof UpdateBookingPlaceTranslation>>
  >(UpdateBookingPlaceTranslation, options);
};
