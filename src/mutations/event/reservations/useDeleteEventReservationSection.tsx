import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_RESERVATION_SECTIONS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSections";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSection";

interface DeleteReservationSectionParams {
  eventId: string;
  reservationSectionId: string;
}

export const DeleteReservationSection = async ({
  eventId,
  reservationSectionId,
}: DeleteReservationSectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}`
  );
  return data;
};

export const useDeleteReservationSection = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteReservationSection({ eventId, reservationSectionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteReservationSection>>
      ) => {
        await router.push(`/events/${eventId}/reservations`);
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId)
        );
        queryClient.removeQueries(
          EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId)
        );
      },
    }
  );
};

export default useDeleteReservationSection;
