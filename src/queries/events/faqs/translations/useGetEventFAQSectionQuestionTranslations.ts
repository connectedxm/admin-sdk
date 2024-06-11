import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_FAQ_SECTION_QUESTION_QUERY_KEY } from "../useGetEventFAQSectionQuestion";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string
) => [
  ...EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, questionId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventFAQSectionQuestionTranslations>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFAQSectionQuestionTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFAQSectionQuestionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sectionId,
  questionId,
  adminApiParams,
}: GetEventFAQSectionQuestionTranslationsProps): Promise<
  ConnectedXMResponse<FAQTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations`,
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
export const useGetEventFAQSectionQuestionTranslations = (
  eventId: string = "",
  sectionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFAQSectionQuestionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFAQSectionQuestionTranslations>>
  >(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
      eventId,
      sectionId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventFAQSectionQuestionTranslations({
        ...params,
        eventId,
        sectionId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sectionId && !!questionId && (options.enabled ?? true),
    }
  );
};
