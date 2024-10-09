import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY,
  EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Locations-Translations
 */
export interface DeleteEventReservationSectionLocationTranslationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations-Translations
 */
export const DeleteEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventReservationSectionLocationTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
        eventId,
        reservationSectionId,
        locationId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(
        eventId,
        reservationSectionId,
        locationId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Locations-Translations
 */
export const useDeleteEventReservationSectionLocationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<
        ReturnType<typeof DeleteEventReservationSectionLocationTranslation>
      >,
      Omit<
        DeleteEventReservationSectionLocationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(
    DeleteEventReservationSectionLocationTranslation,
    options
  );
};
