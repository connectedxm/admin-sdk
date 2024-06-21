import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY } from "@context/queries/events/reservations/translations/useGetEventReservationSectionTranslation";
import { EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/reservations/translations/useGetEventReservationSectionTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventReservationSectionTranslationProps {
  eventId: string;
  reservationSectionId: string;
  locale: string;
}

export const DeleteEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  locale,
}: DeleteEventReservationSectionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventReservationSectionTranslation = (
  eventId: string,
  reservationSectionId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventReservationSectionTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(
          eventId,
          reservationSectionId
        )
      );
      queryClient.invalidateQueries(
        EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY(
          eventId,
          reservationSectionId,
          locale
        )
      );
    },
  });
};

export default useDeleteEventReservationSectionTranslation;
