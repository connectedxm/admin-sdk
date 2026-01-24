import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SummaryData } from "@src/interfaces";
import { EVENT_QUESTION_SUMMARIES_QUERY_KEY } from "./useGetEventQuestionSummaries";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_SUMMARY_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_SUMMARIES_QUERY_KEY(eventId), questionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_SUMMARY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSummary>>
) => {
  client.setQueryData(EVENT_QUESTION_SUMMARY_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionSummaryProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestionSummary = async ({
  adminApiParams,
  eventId,
  questionId,
}: GetEventQuestionSummaryProps): Promise<ConnectedXMResponse<SummaryData>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/summary`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventQuestionSummary = (
  eventId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventQuestionSummary>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestionSummary>>(
    EVENT_QUESTION_SUMMARY_QUERY_KEY(eventId, questionId),
    (params) => GetEventQuestionSummary({ eventId, questionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!questionId,
    }
  );
};
