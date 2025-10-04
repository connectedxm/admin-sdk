import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionSection } from "@src/interfaces";
import { EVENT_SESSION_SECTIONS_QUERY_KEY } from "./useGetEventSessionSections";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_SECTION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  sectionId: string
) => [...EVENT_SESSION_SECTIONS_QUERY_KEY(eventId, sessionId), sectionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSection>>
) => {
  client.setQueryData(EVENT_SESSION_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionSectionProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionSection = async ({
  eventId,
  sessionId,
  sectionId,
  adminApiParams,
}: GetEventSessionSectionProps): Promise<
  ConnectedXMResponse<EventSessionSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionSection = (
  eventId: string = "",
  sessionId: string = "",
  sectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionSection>>(
    EVENT_SESSION_SECTION_QUERY_KEY(eventId, sessionId, sectionId),
    (params: SingleQueryParams) =>
      GetEventSessionSection({ eventId, sessionId, sectionId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!sectionId && (options?.enabled ?? true),
    }
  );
};
