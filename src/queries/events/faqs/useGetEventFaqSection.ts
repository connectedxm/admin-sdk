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
  response: Awaited<ReturnType<typeof GetEventFaqSection>>
) => {
  client.setQueryData(EVENT_FAQ_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetEventFaqSectionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFaqSection = async ({
  eventId,
  sectionId,
  adminApiParams,
}: GetEventFaqSectionProps): Promise<ConnectedXMResponse<FaqSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/faqs/${sectionId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
