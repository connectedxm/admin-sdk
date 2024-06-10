import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoice } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_QUESTION_CHOICES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "CHOICES"];

export const SET_EVENT_QUESTION_CHOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoices>>
) => {
  client.setQueryData(EVENT_QUESTION_CHOICES_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionChoicesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionChoices = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventQuestionChoicesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices`,
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

const useGetEventQuestionChoices = (eventId: string, questionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionChoices>>
  >(
    EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    (params: any) => GetEventQuestionChoices(params),
    {
      eventId,
      questionId,
    },
    {
      enabled: !!eventId && !!questionId,
    }
  );
};

export default useGetEventQuestionChoices;
