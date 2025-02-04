import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestion } from "@src/interfaces";
import { EVENT_QUESTION_SUMMARIES_QUERY_KEY } from "./useGetEventQuestionSummaries";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches summary data for a specific event question, providing various chart types such as bar, line, table, and count.
 * This function is designed to retrieve detailed summary information for a question within an event, which can be used for data visualization and analysis.
 * @name GetEventQuestionSummary
 * @param {string} eventId - The ID of the event
 * @param {string} questionId - The ID of the question
 * @version 1.2
 **/

export interface BarChartSummaryData {
  type: "bar";
  data: {
    label: string;
    value: number;
  }[];
  count: number;
  question?: RegistrationQuestion;
}

export interface LineChartSummaryData {
  type: "line";
  data: {
    label: string;
    value: number;
  }[];
  count: number;
  question?: RegistrationQuestion;
}

export interface TableChartSummaryData {
  type: "table";
  data: {
    value: number;
  }[];
  count: number;
  question?: RegistrationQuestion;
}

export interface CountChartSummaryData {
  type: "count";
  data: null;
  count: number;
  question?: RegistrationQuestion;
}

export type SummaryData =
  | BarChartSummaryData
  | LineChartSummaryData
  | TableChartSummaryData
  | CountChartSummaryData;

export const EVENT_QUESTION_SUMMARY_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_SUMMARIES_QUERY_KEY(eventId), questionId];

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
    },
    "events"
  );
};