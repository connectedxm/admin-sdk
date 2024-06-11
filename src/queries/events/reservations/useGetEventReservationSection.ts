import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSection } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_RESERVATION_SECTIONS_QUERY_KEY } from "./useGetEventReservationSections";

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
  response: Awaited<ReturnType<typeof GetEventReservationSection>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionProps extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventReservationSection = async ({
  eventId,
  reservationSectionId,
  adminApiParams,
}: GetEventReservationSectionProps): Promise<
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
export const useGetEventReservationSection = (
  eventId: string = "",
  reservationSectionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventReservationSection>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventReservationSection>>(
    EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
    (params: SingleQueryParams) =>
      GetEventReservationSection({
        eventId,
        reservationSectionId: reservationSectionId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!reservationSectionId,
    }
  );
};
