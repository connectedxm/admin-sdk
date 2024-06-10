import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";
import { SummaryData } from "./useGetEventQuestionSummary";
import {
  InfiniteParams,
  useConnectedInfiniteQuery,
} from "@/context/queries/useConnectedInfiniteQuery";

export const EVENT_QUESTION_SUMMARIES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "QUESTION_SUMMARIES",
];

export const SET_EVENT_QUESTION_SUMMARIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SUMMARIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSummaries>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SUMMARIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSummariesProps extends InfiniteParams {
  eventId: string;
}

export const GetEventQuestionSummaries = async ({
  eventId,
  pageParam,
  pageSize,
}: GetEventQuestionSummariesProps): Promise<
  ConnectedXMResponse<SummaryData[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/questions/summary`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return data;
};

const useGetEventQuestionSummaries = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSummaries>>
  >(
    EVENT_QUESTION_SUMMARIES_QUERY_KEY(eventId),
    (params: any) => GetEventQuestionSummaries({ ...params, eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventQuestionSummaries;
