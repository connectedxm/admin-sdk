import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationSection } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SECTIONS_QUERY_KEY } from "./useGetEventSections";

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

interface GetEventSectionProps {
  eventId: string;
  sectionId: string;
}

export const GetEventSection = async ({
  eventId,
  sectionId,
}: GetEventSectionProps): Promise<ConnectedXMResponse<RegistrationSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}`
  );
  return data;
};

const useGetEventSection = (eventId: string, sectionId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSection>>(
    EVENT_SECTION_QUERY_KEY(eventId, sectionId),
    () => GetEventSection({ eventId, sectionId }),
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventSection;
