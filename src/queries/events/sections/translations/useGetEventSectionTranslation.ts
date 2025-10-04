import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationSectionTranslation } from "@src/interfaces";
import { EVENT_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSectionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SECTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  locale: string
) => [...EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SECTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSectionTranslationProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
}: GetEventSectionTranslationProps): Promise<
  ConnectedXMResponse<RegistrationSectionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSectionTranslation = (
  eventId: string = "",
  sectionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSectionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSectionTranslation>>(
    EVENT_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    (params: SingleQueryParams) =>
      GetEventSectionTranslation({
        ...params,
        eventId,
        sectionId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!sectionId && !!locale && locale !== "en",
    }
  );
};
