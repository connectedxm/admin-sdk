import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventReservationSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTIONS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSections";
import { SET_EVENT_RESERVATION_SECTION_QUERY_DATA } from "@context/queries/events/reservations/useGetEventReservationSection";

interface CreateReservationSectionParams {
  eventId: string;
  reservationSection: EventReservationSection;
}

export const CreateReservationSection = async ({
  eventId,
  reservationSection,
}: CreateReservationSectionParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections`,
    reservationSection
  );
  return data;
};

export const useCreateReservationSection = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventReservationSection>(
    (reservationSection: EventReservationSection) =>
      CreateReservationSection({ eventId, reservationSection }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateReservationSection>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId)
        );
        SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateReservationSection;
