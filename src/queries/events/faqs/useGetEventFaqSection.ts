import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FaqSection } from "@src/interfaces";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "./useGetEventFaqSections";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches a specific FAQ section for a given event.
 * This function is designed to retrieve detailed information about a particular FAQ section associated with an event.
 * It is useful for applications that need to display or manage event-related FAQ content.
 * @name GetEventFaqSection
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the FAQ section
 * @version 1.3
 **/

export const EVENT_FAQ_SECTION_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTIONS_QUERY_KEY(eventId), sectionId];

export const SET_EVENT_FAQ_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSection>>
) => {
  client.setQueryData(EVENT_FAQ_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetEventFaqSectionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventFaqSection = async ({
  eventId,
  sectionId,
  adminApiParams,
}: GetEventFaqSectionProps): Promise<ConnectedXMResponse<FaqSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/faqs/${sectionId}`);
  return data;
};

export const useGetEventFaqSection = (
  eventId: string = "",
  sectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventFaqSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFaqSection>>(
    EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    (params: SingleQueryParams) =>
      GetEventFaqSection({
        eventId: eventId,
        sectionId: sectionId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options?.enabled ?? true),
    },
    "events"
  );
};