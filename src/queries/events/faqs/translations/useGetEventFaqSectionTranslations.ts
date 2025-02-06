import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FaqSectionTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "../useGetEventFaqSection";

/**
 * Retrieves translations for a specific FAQ section within an event.
 * This function is designed to fetch and manage translations of FAQ sections, allowing for multilingual support in event-related applications.
 * It provides hooks and query keys to facilitate the integration of translation data into the application state.
 * @name GetEventFaqSectionTranslations
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the FAQ section
 * @version 1.3
 **/

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSectionTranslations>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFaqSectionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFaqSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sectionId,
  adminApiParams,
}: GetEventFaqSectionTranslationsProps): Promise<
  ConnectedXMResponse<FaqSectionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFaqSectionTranslations = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFaqSectionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFaqSectionTranslations>>
  >(
    EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventFaqSectionTranslations({
        ...params,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options.enabled ?? true),
    },
    "events"
  );
};
