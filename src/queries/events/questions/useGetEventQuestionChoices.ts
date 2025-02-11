import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoice } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * Provides functionality to retrieve and manage choices for a specific event question.
 * This module includes methods to fetch event question choices, set query data, and utilize infinite queries.
 * It is designed for applications that require dynamic interaction with event question choices data.
 * @name GetEventQuestionChoices
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @version 1.3
 **/

export const EVENT_QUESTION_CHOICES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "CHOICES"];

export const SET_EVENT_QUESTION_CHOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoices>>
) => {
  client.setQueryData(
    [
      ...EVENT_QUESTION_CHOICES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
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
  adminApiParams,
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

export const useGetEventQuestionChoices = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionChoices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionChoices>>
  >(
    EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionChoices({
        ...params,
        eventId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options.enabled ?? true),
    },
    "events"
  );
};
