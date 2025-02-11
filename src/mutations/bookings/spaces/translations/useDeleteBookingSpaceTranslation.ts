import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_TRANSLATIONS_QUERY_KEY,
  BOOKING_SPACE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceTranslationParams extends MutationParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceTranslation = async ({
  bookingPlaceId,
  bookingSpaceId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(
        bookingPlaceId,
        bookingSpaceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_TRANSLATION_QUERY_KEY(
        bookingPlaceId,
        bookingSpaceId,
        locale
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceTranslation>>,
      Omit<
        DeleteBookingSpaceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceTranslationParams,
    Awaited<ReturnType<typeof DeleteBookingSpaceTranslation>>
  >(DeleteBookingSpaceTranslation, options, {
    domain: "events",
    type: "update",
  });
};
