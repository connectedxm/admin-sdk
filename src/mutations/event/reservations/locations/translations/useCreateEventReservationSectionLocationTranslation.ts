import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventReservationSectionLocationTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
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
export interface CreateEventReservationSectionLocationTranslationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations-Translations
 */
export const CreateEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventReservationSectionLocationTranslationParams): Promise<
  ConnectedXMResponse<EventReservationSectionLocationTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventReservationSectionLocationTranslation>
  >(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
export const useCreateEventReservationSectionLocationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<
        ReturnType<typeof CreateEventReservationSectionLocationTranslation>
      >,
      Omit<
        CreateEventReservationSectionLocationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventReservationSectionLocationTranslationParams,
    Awaited<ReturnType<typeof CreateEventReservationSectionLocationTranslation>>
  >(CreateEventReservationSectionLocationTranslation, options, {
    domain: "events",
    type: "update",
  });
};
