import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionSectionTranslation } from "@src/interfaces";
import { EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionSectionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_SECTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  sectionId: string,
  locale: string
) => [
  ...EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY(
    eventId,
    sessionId,
    sectionId
  ),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_SECTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SECTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionSectionTranslationProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionSectionTranslation = async ({
  eventId,
  sessionId,
  sectionId,
  locale,
  adminApiParams,
}: GetEventSessionSectionTranslationProps): Promise<
  ConnectedXMResponse<EventSessionSectionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionSectionTranslation = (
  eventId: string = "",
  sessionId: string = "",
  sectionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionSectionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionSectionTranslation>
  >(
    EVENT_SESSION_SECTION_TRANSLATION_QUERY_KEY(
      eventId,
      sessionId,
      sectionId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventSessionSectionTranslation({
        ...params,
        eventId,
        sessionId,
        sectionId,
        locale,
      }),
    {
      ...options,
      enabled: !!sessionId && !!sectionId && !!locale && locale !== "en",
    },
    "events"
  );
};
