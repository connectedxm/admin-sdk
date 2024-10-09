import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPageTranslation } from "@src/interfaces";
import { EVENT_PAGE_TRANSLATIONS_QUERY_KEY } from "./useGetEventPageTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PAGE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  pageId: string,
  locale: string
) => [...EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PAGE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PAGE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPageTranslation>>
) => {
  client.setQueryData(EVENT_PAGE_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetEventPageTranslationProps extends SingleQueryParams {
  eventId: string;
  pageId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
  adminApiParams,
}: GetEventPageTranslationProps): Promise<
  ConnectedXMResponse<EventPageTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPageTranslation = (
  eventId: string = "",
  pageId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPageTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPageTranslation>>(
    EVENT_PAGE_TRANSLATION_QUERY_KEY(eventId, pageId, locale),
    (params: SingleQueryParams) =>
      GetEventPageTranslation({
        eventId,
        pageId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!pageId && !!locale && locale !== "en",
    },
    "events"
  );
};
