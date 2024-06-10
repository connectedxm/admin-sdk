import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQSection } from "@src/interfaces";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "./useGetEventFAQSections";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_FAQ_SECTION_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTIONS_QUERY_KEY(eventId), sectionId];

export const SET_EVENT_FAQ_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSection>>
) => {
  client.setQueryData(EVENT_FAQ_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetEventFAQSectionProps {
  eventId: string;
  sectionId: string;
}

export const GetEventFAQSection = async ({
  eventId,
  sectionId,
}: GetEventFAQSectionProps): Promise<ConnectedXMResponse<FAQSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/faqs/${sectionId}`);
  return data;
};

const useGetEventFAQSection = (eventId: string, sectionId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSection>>((
    EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    () =>
      GetEventFAQSection({
        eventId: eventId,
        sectionId: sectionId,
      }),
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventFAQSection;
