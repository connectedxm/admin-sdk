import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionSectionQuestion,
} from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_SECTION_QUERY_KEY } from "./useGetEventSessionSection";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  sectionId: string
) => [
  ...EVENT_SESSION_SECTION_QUERY_KEY(eventId, sessionId, sectionId),
  "QUESTIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_SECTION_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSectionQuestions>>
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetEventSessionSectionQuestionsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionSectionQuestions = async ({
  eventId,
  sessionId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionSectionQuestionsProps): Promise<
  ConnectedXMResponse<EventSessionSectionQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/questions`,
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
export const useGetEventSessionSectionQuestions = (
  eventId: string = "",
  sessionId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionSectionQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSectionQuestions>>
  >(
    EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY(eventId, sessionId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionSectionQuestions({
        ...params,
        eventId,
        sessionId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!sectionId && (options.enabled ?? true),
    }
  );
};
