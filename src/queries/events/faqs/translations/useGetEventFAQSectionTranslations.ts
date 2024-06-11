import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQSectionTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "../useGetEventFAQSection";

export const EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId), "TRANSLATIONS"];

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

export const GetEventFAQSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sectionId,
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

const useGetEventFAQSectionTranslations = (
  eventId: string,
  sectionId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFAQSectionTranslations>>
  >(
    EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) => GetEventFAQSectionTranslations(params),
    {
      eventId,
      sectionId,
    },
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventFAQSectionTranslations;
