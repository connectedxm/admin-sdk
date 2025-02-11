import { GetAdminAPI } from "@src/AdminAPI";
import { BookingPlaceTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_PLACE_TRANSLATIONS_QUERY_KEY,
  SET_BOOKING_PLACE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingPlaceTranslationParams extends MutationParams {
  bookingPlaceId: string;
  locale: string;
  autoTranslate?: boolean;
}
/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingPlaceTranslation = async ({
  bookingPlaceId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateBookingPlaceTranslationParams): Promise<
  ConnectedXMResponse<BookingPlaceTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingPlaceTranslation>
  >(`/bookingPlaces/${bookingPlaceId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(bookingPlaceId),
    });
    SET_BOOKING_PLACE_TRANSLATION_QUERY_DATA(
      queryClient,
      [bookingPlaceId, data.data.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 *@group Bookings
 */
export const useCreateBookingPlaceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingPlaceTranslation>>,
      Omit<
        CreateBookingPlaceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingPlaceTranslationParams,
    Awaited<ReturnType<typeof CreateBookingPlaceTranslation>>
  >(CreateBookingPlaceTranslation, options, {
    domain: "events",
    type: "update",
  });
};
