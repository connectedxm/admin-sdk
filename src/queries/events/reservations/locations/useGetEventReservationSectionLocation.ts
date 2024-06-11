import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY } from "./useGetEventReservationSectionLocations";
import { EventReservationSectionLocation } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";

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
  response: Awaited<ReturnType<typeof GetEventReservationSectionLocation>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionProps extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

export const GetEventReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  locationId,
  adminApiParams,
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
  eventId: string = "",
  reservationSectionId: string = "",
  locationId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventReservationSectionLocation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventReservationSectionLocation>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId
    ),
    (params: SingleQueryParams) =>
      GetEventReservationSectionLocation({
        eventId,
        reservationSectionId,
        locationId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!reservationSectionId &&
        !!locationId &&
        (options.enabled ?? true),
    }
  );
};

export default useGetEventReservationSection;
