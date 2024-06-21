import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { EventReservationSectionLocation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTIONS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSections";
import { SET_EVENT_RESERVATION_SECTION_QUERY_DATA } from "@context/queries/events/reservations/useGetEventReservationSection";
import { EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY } from "@context/queries/events/reservations/locations/useGetEventReservationSectionLocations";
import { SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA } from "@context/queries/events/reservations/locations/useGetEventReservationSectionLocation";

interface CreateReservationSectionLocationParams {
  eventId: string;
  reservationSectionId: string;
  location: EventReservationSectionLocation;
}

export const CreateReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  location,
}: CreateReservationSectionLocationParams): Promise<
  ConnectedXMResponse<EventReservationSectionLocation>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations`,
    location
  );
  return data;
};

export const useCreateReservationSectionLocation = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventReservationSectionLocation>(
    (location: EventReservationSectionLocation) =>
      CreateReservationSectionLocation({
        eventId,
        reservationSectionId,
        location,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateReservationSectionLocation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
            eventId,
            reservationSectionId
          )
        );
        SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateReservationSectionLocation;
