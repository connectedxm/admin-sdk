import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY } from "@context/queries/events/reservations/locations/useGetEventReservationSectionLocations";
import { EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY } from "@context/queries/events/reservations/locations/useGetEventReservationSectionLocation";

interface DeleteReservationSectionLocationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

export const DeleteReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  locationId,
}: DeleteReservationSectionLocationParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}`
  );
  return data;
};

export const useDeleteReservationSectionLocation = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () =>
      DeleteReservationSectionLocation({
        eventId,
        reservationSectionId,
        locationId,
      }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteReservationSectionLocation>>
      ) => {
        await router.push(
          `/events/${eventId}/reservations/${reservationSectionId}/locations`
        );
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
            eventId,
            reservationSectionId
          )
        );
        queryClient.removeQueries(
          EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(
            eventId,
            reservationSectionId,
            locationId
          )
        );
      },
    }
  );
};

export default useDeleteReservationSectionLocation;
