import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionSearchValue } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * Retrieves search values for specific event questions.
 * This endpoint allows fetching search values associated with a particular question within an event.
 * It is useful for applications that need to display or process search values related to event questions.
 * @name GetEventQuestionSearchValues
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @version 1.3
 **/

export const EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "SEARCH_VALUES"];

export const SET_EVENT_QUESTION_SEARCH_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSearchValuesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionSearchValues = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/values`,
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

export const useGetEventQuestionSearchValues = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
  >(
    EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionSearchValues({
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
