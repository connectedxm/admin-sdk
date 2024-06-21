import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/reservations/translations/useGetEventReservationSectionTranslation";
import { EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/reservations/translations/useGetEventReservationSectionTranslations";
import { EventReservationSectionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventReservationSectionTranslationProps {
  eventId: string;
  reservationSectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  locale,
  autoTranslate,
}: CreateEventReservationSectionTranslationProps): Promise<
  ConnectedXMResponse<EventReservationSectionTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventReservationSectionTranslation = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<
      CreateEventReservationSectionTranslationProps,
      "eventId" | "reservationSectionId"
    >
  >(
    (props) =>
      CreateEventReservationSectionTranslation({
        eventId,
        reservationSectionId,
        ...props,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof CreateEventReservationSectionTranslation>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventReservationSectionTranslation;
