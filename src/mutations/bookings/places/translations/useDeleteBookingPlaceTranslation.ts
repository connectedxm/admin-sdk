import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_PLACE_TRANSLATIONS_QUERY_KEY,
  BOOKING_PLACE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingPlaceTranslationParams extends MutationParams {
  bookingPlaceId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingPlaceTranslation = async ({
  bookingPlaceId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteBookingPlaceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/bookingPlaces/${bookingPlaceId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(bookingPlaceId),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_TRANSLATION_QUERY_KEY(bookingPlaceId, locale),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingPlaceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingPlaceTranslation>>,
      Omit<
        DeleteBookingPlaceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingPlaceTranslationParams,
    Awaited<ReturnType<typeof DeleteBookingPlaceTranslation>>
  >(DeleteBookingPlaceTranslation, options, {
    domain: "events",
    type: "update",
  });
};
