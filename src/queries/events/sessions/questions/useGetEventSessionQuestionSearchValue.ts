import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionSearchValue } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY } from "./useGetEventSessionQuestionSearchValues";
import {
  useConnectedSingleQuery,
  SingleQueryParams,
  SingleQueryOptions,
} from "../../../useConnectedSingleQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string,
  searchValueId: string
) => [
  ...EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY(
    eventId,
    sessionId,
    questionId
  ),
  searchValueId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionSearchValue>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionSearchValueProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  searchValueId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionSearchValue = async ({
  eventId,
  sessionId,
  questionId,
  searchValueId,
  adminApiParams,
}: GetEventSessionQuestionSearchValueProps): Promise<
  ConnectedXMResponse<EventSessionQuestionSearchValue>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values/${searchValueId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionQuestionSearchValue = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  searchValueId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionQuestionSearchValue>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionQuestionSearchValue>
  >(
    EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      searchValueId
    ),
    (params: SingleQueryParams) =>
      GetEventSessionQuestionSearchValue({
        eventId,
        sessionId,
        questionId,
        searchValueId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!questionId &&
        !!searchValueId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
