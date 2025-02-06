import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Faq } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "./useGetEventFaqSection";

/**
 * Endpoint to fetch questions from a specific section of an event's FAQ.
 * This function retrieves a list of questions associated with a particular FAQ section within an event.
 * It is useful for applications that need to display or manage FAQ content for event participants.
 * @name GetEventFaqSectionQuestions
 * @param {string} sectionId (path) The id of the FAQ section
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

export const EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId), "QUESTIONS"];

export const SET_EVENT_FAQ_SECTION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSectionQuestions>>
) => {
  client.setQueryData(
    [
      ...EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetEventFaqSectionQuestionsProps extends InfiniteQueryParams {
  sectionId: string;
  eventId: string;
}

export const GetEventFaqSectionQuestions = async ({
  sectionId,
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFaqSectionQuestionsProps): Promise<ConnectedXMResponse<Faq[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions`,
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

export const useGetEventFaqSectionQuestions = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFaqSectionQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFaqSectionQuestions>>
  >(
    EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventFaqSectionQuestions({
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
