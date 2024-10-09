import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY } from "./useGetReservationSectionLocations";
import { EventReservationSectionLocation } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
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

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReservationSectionLocation>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetReservationSectionProps extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  locationId,
  adminApiParams,
}: GetReservationSectionProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetReservationSectionLocation = (
  eventId: string = "",
  reservationSectionId: string = "",
  locationId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetReservationSectionLocation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetReservationSectionLocation>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId
    ),
    (params: SingleQueryParams) =>
      GetReservationSectionLocation({
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
    },
    "events"
  );
};
