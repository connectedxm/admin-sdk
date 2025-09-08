import { ConnectedXMResponse } from "@src/interfaces";
import { SearchListValue } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Event-Session-Question-SearchList-Values
 */
export const EVENT_SESSION_QUESTION_SEARCHLIST_VALUES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  "EVENT_SESSION_QUESTION_SEARCHLIST_VALUES",
  eventId,
  sessionId,
  questionId,
];

/**
 * @category Setters
 * @group Event-Session-Question-SearchList-Values
 */
export const SET_EVENT_SESSION_QUESTION_SEARCHLIST_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_SESSION_QUESTION_SEARCHLIST_VALUES_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionSearchListValues>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_SEARCHLIST_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionSearchListValuesProps
  extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Event-Session-Question-SearchList-Values
 */
export const GetEventSessionQuestionSearchListValues = async ({
  eventId,
  sessionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionQuestionSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/searchlist/values`,
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
/**
 * @category Hooks
 * @group Event-Session-Question-SearchList-Values
 */
export const useGetEventSessionQuestionSearchListValues = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchListValues>>
  >(
    EVENT_SESSION_QUESTION_SEARCHLIST_VALUES_QUERY_KEY(
      eventId,
      sessionId,
      questionId
    ),
    (queryParams: InfiniteQueryParams) =>
      GetEventSessionQuestionSearchListValues({
        eventId,
        sessionId,
        questionId,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled ?? true),
    },
    "events"
  );
};
