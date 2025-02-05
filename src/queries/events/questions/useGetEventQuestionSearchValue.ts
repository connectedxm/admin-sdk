import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionSearchValue } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "./useGetEventQuestionSearchValues";
import {
  useConnectedSingleQuery,
  SingleQueryParams,
  SingleQueryOptions,
} from "../../useConnectedSingleQuery";

/**
 * Retrieves a specific search value associated with an event question.
 * This function is designed to fetch detailed information about a particular search value linked to a question within an event.
 * It is useful in scenarios where precise data retrieval for event-related questions is required.
 * @name GetEventQuestionSearchValue
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @param {string} searchValueId - The id of the search value
 * @version 1.2
 **/

export const EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY = (
  eventId: string,
  questionId: string,
  searchValueId: string
) => [
  ...EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
  searchValueId,
];

export const SET_EVENT_QUESTION_SEARCH_VALUE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSearchValue>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSearchValueProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
}

export const GetEventQuestionSearchValue = async ({
  eventId,
  questionId,
  searchValueId,
  adminApiParams,
}: GetEventQuestionSearchValueProps): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/values/${searchValueId}`
  );
  return data;
};

export const useGetEventQuestionSearchValue = (
  eventId: string = "",
  questionId: string = "",
  searchValueId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionSearchValue>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventQuestionSearchValue>
  >(
    EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY(eventId, questionId, searchValueId),
    (params: SingleQueryParams) =>
      GetEventQuestionSearchValue({
        eventId,
        questionId,
        searchValueId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!questionId &&
        !!searchValueId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};