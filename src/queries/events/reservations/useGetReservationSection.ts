import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSection } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTIONS_QUERY_KEY } from "./useGetReservationSections";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_RESERVATION_SECTION_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string
) => [...EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId), reservationSectionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReservationSection>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetReservationSectionProps extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetReservationSection = async ({
  eventId,
  reservationSectionId,
  adminApiParams,
}: GetReservationSectionProps): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetReservationSection = (
  eventId: string = "",
  reservationSectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetReservationSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReservationSection>>(
    EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
    (params: SingleQueryParams) =>
      GetReservationSection({
        eventId,
        reservationSectionId: reservationSectionId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!reservationSectionId,
    },
    "events"
  );
};
