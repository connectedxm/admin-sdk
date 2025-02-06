import { ConnectedXMResponse, EventSessionQuestion } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_QUERY_KEY } from "../useGetEventSession";

/**
 * Endpoint to retrieve and manage questions for a specific event session.
 * This function allows users to fetch a list of questions associated with a particular event session.
 * It is designed to be used in applications where detailed information about session questions is required.
 * @name GetEventSessionQuestions
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @version 1.3
 **/

export const EVENT_SESSION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "QUESTIONS"];

export const SET_EVENT_SESSION_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestions>>
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetEventSessionQuestionsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

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