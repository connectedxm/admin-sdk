import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionChoice } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
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
export const EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUESTION_QUERY_KEY(eventId, sessionId, questionId),
  "CHOICES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_CHOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionChoices>>
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetEventSessionQuestionChoicesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionChoices = async ({
  eventId,
  sessionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionQuestionChoicesProps): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices`,
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
export const useGetEventSessionQuestionChoices = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionChoices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionChoices>>
  >(
    EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(eventId, sessionId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestionChoices({
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
    }
  );
};
