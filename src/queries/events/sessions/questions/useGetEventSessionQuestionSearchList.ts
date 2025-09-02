import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SearchList } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Event-Session-Question-SearchList
 */
export const EVENT_SESSION_QUESTION_SEARCHLIST_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => ["EVENT_SESSION_QUESTION_SEARCHLIST", eventId, sessionId, questionId];

/**
 * @category Setters
 * @group Event-Session-Question-SearchList
 */
export const SET_EVENT_SESSION_QUESTION_SEARCHLIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_SEARCHLIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionSearchList>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_SEARCHLIST_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionSearchListProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Event-Session-Question-SearchList
 */
export const GetEventSessionQuestionSearchList = async ({
  eventId,
  sessionId,
  questionId,
  adminApiParams,
}: GetEventSessionQuestionSearchListProps): Promise<
  ConnectedXMResponse<SearchList>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/searchlist`
  );
  return data;
};
/**
 * @category Hooks
 * @group Event-Session-Question-SearchList
 */
export const useGetEventSessionQuestionSearchList = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionQuestionSearchList>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionQuestionSearchList>
  >(
    EVENT_SESSION_QUESTION_SEARCHLIST_QUERY_KEY(eventId, sessionId, questionId),
    (params: SingleQueryParams) =>
      GetEventSessionQuestionSearchList({
        eventId,
        sessionId,
        questionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled ?? true),
    },
    "events"
  );
};
