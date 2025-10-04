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
  placeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingPlaceTranslation = async ({
  placeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteBookingPlaceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/bookings/places/${placeId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(placeId),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_TRANSLATION_QUERY_KEY(placeId, locale),
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
  >(DeleteBookingPlaceTranslation, options);
};
