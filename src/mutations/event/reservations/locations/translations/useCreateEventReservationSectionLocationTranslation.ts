import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA } from "@context/queries/events/reservations/locations/translations/useGetEventReservationSectionLocationTranslation";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/reservations/locations/translations/useGetEventReservationSectionLocationTranslations";
import { EventReservationSectionLocationTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventReservationSectionLocationTranslationProps {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
  autoTranslate,
}: CreateEventReservationSectionLocationTranslationProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocationTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventReservationSectionLocationTranslation = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<
      CreateEventReservationSectionLocationTranslationProps,
      "eventId" | "reservationSectionId" | "locationId"
    >
  >(
    (props) =>
      CreateEventReservationSectionLocationTranslation({
        eventId,
        reservationSectionId,
        locationId,
        ...props,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof CreateEventReservationSectionLocationTranslation>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventReservationSectionLocationTranslation;
