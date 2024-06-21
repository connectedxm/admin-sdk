import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY } from "@context/queries/events/reservations/locations/translations/useGetEventReservationSectionLocationTranslation";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/reservations/locations/translations/useGetEventReservationSectionLocationTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventReservationSectionLocationTranslationProps {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
}

export const DeleteEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
}: DeleteEventReservationSectionLocationTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventReservationSectionLocationTranslation = (
  eventId: string,
  reservationSectionId: string,
  locationId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(
    DeleteEventReservationSectionLocationTranslation,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
            eventId,
            reservationSectionId,
            locationId
          )
        );
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(
            eventId,
            reservationSectionId,
            locationId,
            locale
          )
        );
      },
    }
  );
};

export default useDeleteEventReservationSectionLocationTranslation;
