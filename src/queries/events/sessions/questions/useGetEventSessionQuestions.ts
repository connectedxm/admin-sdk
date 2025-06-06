import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SESSION_QUERY_KEY } from "../useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "QUESTIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestions>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestions = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionQuestionsProps): Promise<
  ConnectedXMResponse<EventSessionQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions`,
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
export const useGetEventSessionQuestions = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestions>>
  >(
    EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestions({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    },
    "events"
  );
};
