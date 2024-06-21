import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/reservations/translations/useGetEventReservationSectionTranslation";
import { EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/reservations/translations/useGetEventReservationSectionTranslations";
import { EventReservationSectionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventReservationSectionTranslationProps {
  eventId: string;
  reservationSectionId: string;
  reservationSectionTranslation: EventReservationSectionTranslation;
}

export const UpdateEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  reservationSectionTranslation,
}: UpdateEventReservationSectionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = reservationSectionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations/${reservationSectionTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventReservationSectionTranslation = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<EventReservationSectionTranslation>(
    (reservationSectionTranslation: EventReservationSectionTranslation) =>
      UpdateEventReservationSectionTranslation({
        eventId,
        reservationSectionId,
        reservationSectionTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateEventReservationSectionTranslation>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(
            eventId,
            reservationSectionId
          )
        );
        SET_EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventReservationSectionTranslation;
