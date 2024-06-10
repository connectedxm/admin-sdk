import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  RegistrationQuestion,
  RegistrationQuestionType,
} from "@src/interfaces";
import { EVENT_QUESTION_SUMMARIES_QUERY_KEY } from "./useGetEventQuestionSummaries";
import { QueryClient } from "@tanstack/react-query";

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

export const SET_EVENT_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSummary>>
) => {
  client.setQueryData(EVENT_QUESTION_SUMMARY_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionSummaryProps {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionSummary = async ({
  eventId,
  questionId,
}: GetEventQuestionSummaryProps): Promise<ConnectedXMResponse<SummaryData>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/summary`
  );
  return data;
};

const useGetEventQuestionSummary = (eventId: string, questionId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestionSummary>>((
    EVENT_QUESTION_SUMMARY_QUERY_KEY(eventId, questionId),
    () => GetEventQuestionSummary({ eventId, questionId }),
    {
      enabled: !!eventId && !!questionId,
    }
  );
};

export default useGetEventQuestionSummary;
