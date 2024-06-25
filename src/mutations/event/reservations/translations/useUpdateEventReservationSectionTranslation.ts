import { GetAdminAPI } from "@src/AdminAPI";
import { EventReservationSectionTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Translations
 */
export interface UpdateEventReservationSectionTranslationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  reservationSectionTranslation: EventReservationSectionTranslation;
}

/**
 * @category Methods
 * @group Event-Reservations-Translations
 */
export const UpdateEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  reservationSectionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventReservationSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = reservationSectionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations/${locale}`,
    body
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
    SET_EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Translations
 */
export const useUpdateEventReservationSectionTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventReservationSectionTranslation>>,
      Omit<
        UpdateEventReservationSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventReservationSectionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventReservationSectionTranslation>>
  >(UpdateEventReservationSectionTranslation, options);
};
