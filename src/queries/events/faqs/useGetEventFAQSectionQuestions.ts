import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQ } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "./useGetEventFAQSection";

export const EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId), "QUESTIONS"];

export const SET_EVENT_FAQ_SECTIONS_QUERY_DATA = (
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

export const GetEventFAQSectionQuestions = async ({
  sectionId,
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetEventFAQSectionQuestionsectionQuestions = (
  eventId: string,
  sectionId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFAQSectionQuestions>>
  >(
    EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) => GetEventFAQSectionQuestions(params),
    {
      eventId,
      sectionId,
    },
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventFAQSectionQuestionsectionQuestions;
