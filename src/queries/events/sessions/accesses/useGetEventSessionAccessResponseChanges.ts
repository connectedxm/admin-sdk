import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionResponseChange,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_ACCESS_QUERY_KEY } from "./useGetEventSessionAccess";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ACCESS_RESPONSE_CHANGES_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_ACCESS_QUERY_KEY(eventId, sessionId, passId),
  questionId,
  "CHANGES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ACCESS_RESPONSE_CHANGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ACCESS_RESPONSE_CHANGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionAccessResponseChanges>>
) => {
  client.setQueryData(
    EVENT_SESSION_ACCESS_RESPONSE_CHANGES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionAccessResponseChangesProps
  extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionAccessResponseChanges = async ({
  eventId,
  sessionId,
  passId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionAccessResponseChangesProps): Promise<
  ConnectedXMResponse<EventSessionQuestionResponseChange[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/responses/${questionId}/changes`,
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
export const useGetEventSessionAccessResponseChanges = (
  eventId: string = "",
  sessionId: string = "",
  passId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionAccessResponseChanges>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionAccessResponseChanges>>
  >(
    EVENT_SESSION_ACCESS_RESPONSE_CHANGES_QUERY_KEY(
      eventId,
      sessionId,
      passId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionAccessResponseChanges({
        ...params,
        eventId,
        sessionId,
        passId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!passId &&
        !!questionId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
