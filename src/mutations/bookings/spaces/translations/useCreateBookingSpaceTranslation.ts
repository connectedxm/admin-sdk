import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_TRANSLATIONS_QUERY_KEY,
  SET_BOOKING_SPACE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingSpaceTranslationParams extends MutationParams {
  placeId: string;
  spaceId: string;
  locale: string;
  autoTranslate?: boolean;
}
/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpaceTranslation = async ({
  placeId,
  spaceId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceTranslationParams): Promise<
  ConnectedXMResponse<BookingSpaceTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingSpaceTranslation>
  >(`/bookings/places/${placeId}/bookingspaces/${spaceId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(placeId, spaceId),
    });
    SET_BOOKING_SPACE_TRANSLATION_QUERY_DATA(
      queryClient,
      [placeId, spaceId, data.data.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 *@group Bookings
 */
export const useCreateBookingSpaceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingSpaceTranslation>>,
      Omit<
        CreateBookingSpaceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingSpaceTranslationParams,
    Awaited<ReturnType<typeof CreateBookingSpaceTranslation>>
  >(CreateBookingSpaceTranslation, options, {
    domain: "bookings",
    type: "update",
  });
};
