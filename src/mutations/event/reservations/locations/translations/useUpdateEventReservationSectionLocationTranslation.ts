import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA } from "@context/queries/events/reservations/locations/translations/useGetEventReservationSectionLocationTranslation";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/reservations/locations/translations/useGetEventReservationSectionLocationTranslations";
import { EventReservationSectionLocationTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventReservationSectionLocationTranslationProps {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locationTranslation: EventReservationSectionLocationTranslation;
}

export const UpdateEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locationTranslation,
}: UpdateEventReservationSectionLocationTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = locationTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locationTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventReservationSectionLocationTranslation = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<EventReservationSectionLocationTranslation>(
    (locationTranslation: EventReservationSectionLocationTranslation) =>
      UpdateEventReservationSectionLocationTranslation({
        eventId,
        reservationSectionId,
        locationId,
        locationTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateEventReservationSectionLocationTranslation>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
            eventId,
            reservationSectionId,
            locationId
          )
        );
        SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId, locationId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventReservationSectionLocationTranslation;
