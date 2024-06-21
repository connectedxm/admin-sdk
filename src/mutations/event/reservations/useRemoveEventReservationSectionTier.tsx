import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventReservationSection } from "@interfaces";
import { EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSectionTiers";
import { SET_EVENT_RESERVATION_SECTION_QUERY_DATA } from "@context/queries/events/reservations/useGetEventReservationSection";

interface RemoveEventReservationSectionTierParams {
  eventId: string;
  reservationSectionId: string;
  tierId: string;
}

export const RemoveEventReservationSectionTier = async ({
  eventId,
  reservationSectionId,
  tierId,
}: RemoveEventReservationSectionTierParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tiers/${tierId}`
  );
  return data;
};

export const useRemoveEventReservationSectionTier = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (tierId: string) =>
      RemoveEventReservationSectionTier({
        eventId,
        reservationSectionId,
        tierId,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventReservationSectionTier>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY(
            eventId,
            reservationSectionId
          )
        );
        SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId],
          response
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventReservationSectionTier;
