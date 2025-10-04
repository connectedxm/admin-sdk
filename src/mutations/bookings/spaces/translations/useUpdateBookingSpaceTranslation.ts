import { ISupportedLocale } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceTranslationUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_TRANSLATIONS_QUERY_KEY,
  SET_BOOKING_SPACE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceTranslationParams extends MutationParams {
  placeId: string;
  spaceId: string;
  locale: ISupportedLocale;
  bookingSpaceTranslation: BookingSpaceTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceTranslation = async ({
  placeId,
  spaceId,
  bookingSpaceTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/bookings/places/${placeId}/spaces/${spaceId}/translations/${locale}`,
    bookingSpaceTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(placeId, spaceId),
    });
    SET_BOOKING_SPACE_TRANSLATION_QUERY_DATA(
      queryClient,
      [placeId, spaceId, data?.data?.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceTranslation>>,
      Omit<
        UpdateBookingSpaceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceTranslationParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceTranslation>>
  >(UpdateBookingSpaceTranslation, options);
};
