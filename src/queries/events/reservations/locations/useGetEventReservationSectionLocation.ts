import { useConnectedSingleQuery } from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY } from "./useGetEventReservationSectionLocations";
import { EventReservationSectionLocation } from "@src/interfaces";

export const EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => [
  ...EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
    eventId,
    reservationSectionId
  ),
  locationId,
];

export const SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservationSection>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionProps {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

export const GetEventReservationSection = async ({
  eventId,
  reservationSectionId,
  locationId,
}: GetEventReservationSectionProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}`
  );
  return data;
};

const useGetEventReservationSection = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventReservationSection>>((
    EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId
    ),
    () =>
      GetEventReservationSection({
        eventId,
        reservationSectionId: reservationSectionId || "unknown",
        locationId,
      }),
    {
      enabled: !!eventId && !!reservationSectionId && !!locationId,
    }
  );
};

export default useGetEventReservationSection;
