import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SECTIONS_QUERY_KEY } from "./useGetEventSections";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SECTION_QUERY_KEY = (eventId: string, sectionId: string) => [
  ...EVENT_SECTIONS_QUERY_KEY(eventId),
  sectionId,
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
