import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SearchList } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Event-Question-SearchList
 */
export const EVENT_QUESTION_SEARCHLIST_QUERY_KEY = (
  eventId: string,
  questionId: string
) => ["EVENT_QUESTION_SEARCHLIST", eventId, questionId];

/**
 * @category Setters
 * @group Event-Question-SearchList
 */
export const SET_EVENT_QUESTION_SEARCHLIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SEARCHLIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSearchList>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SEARCHLIST_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSearchListProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Event-Question-SearchList
 */
export const GetEventQuestionSearchList = async ({
  eventId,
  questionId,
  adminApiParams,
}: GetEventQuestionSearchListProps): Promise<
  ConnectedXMResponse<SearchList>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/searchlist`
  );
  return data;
};
/**
 * @category Hooks
 * @group Event-Question-SearchList
 */
export const useGetEventQuestionSearchList = (
  eventId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionSearchList>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestionSearchList>>(
    EVENT_QUESTION_SEARCHLIST_QUERY_KEY(eventId, questionId),
    (params: SingleQueryParams) =>
      GetEventQuestionSearchList({ eventId, questionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!questionId && (options?.enabled ?? true),
    },
    "events"
  );
};
