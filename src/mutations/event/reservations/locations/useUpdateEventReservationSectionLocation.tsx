import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { EventReservationSectionLocation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY } from "@context/queries/events/reservations/locations/useGetEventReservationSectionLocations";
import { SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA } from "@context/queries/events/reservations/locations/useGetEventReservationSectionLocation";

interface UpdateReservationSectionLocationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  location: EventReservationSectionLocation;
}

export const UpdateReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  locationId,
  location,
}: UpdateReservationSectionLocationParams): Promise<
  ConnectedXMResponse<EventReservationSectionLocation>
> => {
  if (!reservationSectionId)
    throw new Error("Reservation Section ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}`,
    {
      ...location,
      id: undefined,
      eventId: undefined,
      reservationSectionId: undefined,
      reservationSection: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
  );
  return data;
};

export const useUpdateReservationSectionLocation = (
  eventId: string,
  reservationSectionId: string,
  locationId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventReservationSectionLocation>(
    (location: EventReservationSectionLocation) =>
      UpdateReservationSectionLocation({
        eventId,
        reservationSectionId,
        locationId: locationId || location?.id,
        location,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateReservationSectionLocation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
            eventId,
            reservationSectionId
          )
        );
        SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId, locationId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateReservationSectionLocation;
