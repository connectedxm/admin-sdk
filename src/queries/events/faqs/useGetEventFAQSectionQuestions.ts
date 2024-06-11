import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQ } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "./useGetEventFAQSection";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId), "QUESTIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSectionQuestions>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFAQSectionQuestionsProps extends InfiniteQueryParams {
  sectionId: string;
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFAQSectionQuestions = async ({
  sectionId,
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFAQSectionQuestionsProps): Promise<ConnectedXMResponse<FAQ[]>> => {
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
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFAQSectionQuestionsectionQuestions = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFAQSectionQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFAQSectionQuestions>>
  >(
    EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventFAQSectionQuestions({
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
