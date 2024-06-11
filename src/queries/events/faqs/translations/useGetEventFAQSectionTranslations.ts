import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQSectionTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "../useGetEventFAQSection";

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
  response: Awaited<ReturnType<typeof GetEventFAQSectionTranslations>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFAQSectionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFAQSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sectionId,
  adminApiParams,
}: GetEventFAQSectionTranslationsProps): Promise<
  ConnectedXMResponse<FAQSectionTranslation[]>
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
export const useGetEventFAQSectionTranslations = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFAQSectionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFAQSectionTranslations>>
  >(
    EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventFAQSectionTranslations({
        ...params,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options.enabled ?? true),
    }
  );
};
