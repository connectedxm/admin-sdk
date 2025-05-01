import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionSearchValue } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUESTION_QUERY_KEY } from "./useGetEventSessionQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUESTION_QUERY_KEY(eventId, sessionId, questionId),
  "SEARCH_VALUES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionSearchValues>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionSearchValuesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionSearchValues = async ({
  eventId,
  sessionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<EventSessionQuestionSearchValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values`,
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
 * @group Events
 */
export const useGetEventSessionQuestionSearchValues = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchValues>>
  >(
    EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY(
      eventId,
      sessionId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestionSearchValues({
        ...params,
        eventId,
        sessionId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options.enabled ?? true),
    },
    "events"
  );
};
