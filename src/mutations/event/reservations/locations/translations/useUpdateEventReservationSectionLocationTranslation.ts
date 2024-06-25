import { GetAdminAPI } from "@src/AdminAPI";
import { EventReservationSectionLocationTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Locations-Translations
 */
export interface UpdateEventReservationSectionLocationTranslationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  //TODO: missing reference
  locationTranslation: EventReservationSectionLocationTranslation;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations-Translations
 */
export const UpdateEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locationTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventReservationSectionLocationTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = locationTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`,
    body
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
        eventId,
        reservationSectionId,
        locationId
      ),
    });
    SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId, locationId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Locations-Translations
 */
export const useUpdateEventReservationSectionLocationTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof UpdateEventReservationSectionLocationTranslation>
      >,
      Omit<
        UpdateEventReservationSectionLocationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventReservationSectionLocationTranslationParams,
    Awaited<ReturnType<typeof UpdateEventReservationSectionLocationTranslation>>
  >(UpdateEventReservationSectionLocationTranslation, options);
};
