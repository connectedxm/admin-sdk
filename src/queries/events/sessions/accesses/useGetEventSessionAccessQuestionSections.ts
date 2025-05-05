import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SESSION_ACCESS_QUERY_KEY } from "./useGetEventSessionAccess";

/**
 * @category Keys
 * @group Surveys
 */
export const EVENT_SESSION_ACCESS_SESSION_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  passId: string
) => [
  ...EVENT_SESSION_ACCESS_QUERY_KEY(eventId, sessionId, passId),
  "SECTIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_EVENT_SESSION_ACCESS_SESSION_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_SESSION_ACCESS_SESSION_QUESTION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventSessionAccessQuestionSections>>
) => {
  client.setQueryData(
    EVENT_SESSION_ACCESS_SESSION_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionAccessQuestionSectionsProps
  extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetEventSessionAccessQuestionSections = async ({
  eventId,
  sessionId,
  passId,
  adminApiParams,
}: GetEventSessionAccessQuestionSectionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<
    ConnectedXMResponse<EventSessionSection[]>
  >(`/events/${eventId}/sessions/${sessionId}/passes/${passId}/sections`);
  return data;
};

/**
 * @category Hooks
 * @group Surveys
 */
export const useGetEventSessionAccessQuestionSections = (
  eventId: string = "",
  sessionId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionAccessQuestionSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionAccessQuestionSections>>
  >(
    EVENT_SESSION_ACCESS_SESSION_QUESTION_SECTIONS_QUERY_KEY(
      eventId,
      sessionId,
      passId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionAccessQuestionSections({
        ...params,
        eventId,
        sessionId,
        passId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!passId && (options?.enabled ?? true),
    },
    "events"
  );
};
