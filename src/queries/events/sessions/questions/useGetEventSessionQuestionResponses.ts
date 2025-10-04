import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUESTION_QUERY_KEY } from "./useGetEventSessionQuestion";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_RESPONSES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUESTION_QUERY_KEY(eventId, sessionId, questionId),
  "RESPONSES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_RESPONSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionResponses>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionResponsesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionResponses = async ({
  eventId,
  sessionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionQuestionResponsesProps): Promise<
  ConnectedXMResponse<EventSessionQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/responses`,
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
export const useGetEventSessionQuestionResponses = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionResponses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionResponses>>
  >(
    EVENT_SESSION_QUESTION_RESPONSES_QUERY_KEY(eventId, sessionId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestionResponses({
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
