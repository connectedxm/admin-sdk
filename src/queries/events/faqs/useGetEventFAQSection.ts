import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQSection } from "@src/interfaces";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "./useGetEventFAQSections";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FAQ_SECTION_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTIONS_QUERY_KEY(eventId), sectionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSection>>
) => {
  client.setQueryData(EVENT_FAQ_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetEventFAQSectionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFAQSection = async ({
  eventId,
  sectionId,
  adminApiParams,
}: GetEventFAQSectionProps): Promise<ConnectedXMResponse<FAQSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/faqs/${sectionId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFAQSection = (
  eventId: string = "",
  sectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventFAQSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSection>>(
    EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    (params: SingleQueryParams) =>
      GetEventFAQSection({
        eventId: eventId,
        sectionId: sectionId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options?.enabled ?? true),
    }
  );
};
