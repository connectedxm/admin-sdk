import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY,
  EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Translations
 */
export interface DeleteEventReservationSectionTranslationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Reservations-Translations
 */
export const DeleteEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventReservationSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY(
        eventId,
        reservationSectionId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Translations
 */
export const useDeleteEventReservationSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventReservationSectionTranslation>>,
      Omit<
        DeleteEventReservationSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventReservationSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventReservationSectionTranslation>>
  >(DeleteEventReservationSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};

export default useDeleteEventReservationSectionTranslation;
