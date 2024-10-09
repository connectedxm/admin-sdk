import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventReservationSectionLocationTranslationUpdateInputs } from "@src/params";
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
  locale: ISupportedLocale;
  locationId: string;
  locationTranslation: EventReservationSectionLocationTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations-Translations
 */
export const UpdateEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
  locationTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventReservationSectionLocationTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`,
    locationTranslation
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
    ConnectedXMMutationOptions<
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
  >(UpdateEventReservationSectionLocationTranslation, options, {
    domain: "events",
    type: "update",
  });
};
