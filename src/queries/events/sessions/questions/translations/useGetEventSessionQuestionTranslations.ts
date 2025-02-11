import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionTranslation,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUESTION_QUERY_KEY } from "../useGetEventSessionQuestion";

/**
 * Retrieves translations for a specific event session question.
 * This function fetches a list of translations associated with a particular question within an event session.
 * It is useful for applications that need to display or manage multilingual content for event session questions.
 * @name GetEventSessionQuestionTranslations
 * @param {string} eventId (path) The ID of the event
 * @param {string} sessionId (path) The ID of the session
 * @param {string} questionId (path) The ID of the question
 * @version 1.3
 **/

export const EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUESTION_QUERY_KEY(eventId, sessionId, questionId),
  "TRANSLATIONS",
];

export const SET_EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionTranslations>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

export const GetEventSessionQuestionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sessionId,
  questionId,
  adminApiParams,
}: GetEventSessionQuestionTranslationsProps): Promise<
  ConnectedXMResponse<EventSessionQuestionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations`,
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

export const useGetEventSessionQuestionTranslations = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionTranslations>>
  >(
    EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY(
      eventId,
      sessionId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestionTranslations({
        ...params,
        eventId,
        sessionId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    },
    "events"
  );
};
