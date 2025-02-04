import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationSection } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SECTIONS_QUERY_KEY } from "./useGetEventSections";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches details for a specific event section by its ID within a given event.
 * This function is designed to retrieve detailed information about a particular section of an event, 
 * which can be used in applications that require insights into event structures.
 * @name GetEventSection
 * @param {string} eventId - The ID of the event
 * @param {string} sectionId - The ID of the section
 * @version 1.2
 **/

export const EVENT_SECTION_QUERY_KEY = (eventId: string, sectionId: string) => [
  ...EVENT_SECTIONS_QUERY_KEY(eventId),
  sectionId,
];

export const SET_EVENT_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSection>>
) => {
  client.setQueryData(EVENT_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventSection = async ({
  eventId,
  sectionId,
  adminApiParams,
}: GetEventSectionProps): Promise<ConnectedXMResponse<RegistrationSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}`
  );
  return data;
};

export const useGetEventSection = (
  eventId: string = "",
  sectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSection>>(
    EVENT_SECTION_QUERY_KEY(eventId, sectionId),
    (params) => GetEventSection({ eventId, sectionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options?.enabled ?? true),
    },
    "events"
  );
};