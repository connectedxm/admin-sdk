import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPageTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_PAGE_QUERY_KEY } from "../useGetEventPage";

/**
 * Retrieves translations for a specific event page.
 * This function fetches translations associated with a given event and page ID, allowing applications to display localized content for event pages.
 * It is designed to be used in scenarios where multilingual support for event pages is required.
 * @name GetEventPageTranslations
 * @param {string} eventId (path) - The ID of the event
 * @param {string} pageId (path) - The ID of the page
 * @version 1.3
**/

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PAGE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  pageId: string
) => [...EVENT_PAGE_QUERY_KEY(eventId, pageId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PAGE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PAGE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPageTranslations>>
) => {
  client.setQueryData(
    EVENT_PAGE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPageTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  pageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPageTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  pageId,
  adminApiParams,
}: GetEventPageTranslationsProps): Promise<
  ConnectedXMResponse<EventPageTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/pages/${pageId}/translations`,
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
export const useGetEventPageTranslations = (
  eventId: string = "",
  pageId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPageTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPageTranslations>>
  >(
    EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId),
    (params: InfiniteQueryParams) =>
      GetEventPageTranslations({ ...params, eventId, pageId }),
    params,
    {
      ...options,
      enabled: !!eventId && !!pageId && (options.enabled ?? true),
    },
    "events"
  );
};