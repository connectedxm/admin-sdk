import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventReservationSectionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
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
export interface CreateEventReservationSectionTranslationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Reservations-Translations
 */
export const CreateEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventReservationSectionTranslationParams): Promise<
  ConnectedXMResponse<EventReservationSectionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventReservationSectionTranslation>
  >(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
export const useCreateEventReservationSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventReservationSectionTranslation>>,
      Omit<
        CreateEventReservationSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventReservationSectionTranslationParams,
    Awaited<ReturnType<typeof CreateEventReservationSectionTranslation>>
  >(CreateEventReservationSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
