import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventReservationSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_RESERVATION_SECTION_QUERY_DATA } from "@context/queries/events/reservations/useGetEventReservationSection";
import { EVENT_RESERVATION_SECTIONS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSections";

interface UpdateReservationSectionParams {
  eventId: string;
  reservationSectionId: string;
  reservationSection: EventReservationSection;
}

export const UpdateReservationSection = async ({
  eventId,
  reservationSectionId,
  reservationSection,
}: UpdateReservationSectionParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  if (!reservationSectionId)
    throw new Error("Reservation Section ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}`,
    {
      ...reservationSection,
      id: undefined,
      event: undefined,
      eventId: undefined,
      allowedTickets: undefined,
      allowedTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      image: undefined,
    }
  );
  return data;
};

export const useUpdateReservationSection = (
  eventId: string,
  reservationSectionId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventReservationSection>(
    (reservationSection: EventReservationSection) =>
      UpdateReservationSection({
        eventId,
        reservationSectionId: reservationSectionId || reservationSection?.id,
        reservationSection,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateReservationSection>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId)
        );
        SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateReservationSection;
