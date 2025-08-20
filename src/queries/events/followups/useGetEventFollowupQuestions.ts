import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationFollowupQuestion,
} from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_FOLLOWUP_QUERY_KEY } from "./useGetEventFollowup";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUP_QUESTIONS_QUERY_KEY = (
  eventId: string,
  followupId: string
) => [...EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId), "QUESTIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowupQuestions>>
) => {
  client.setQueryData(
    [
      ...EVENT_FOLLOWUP_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    },
    "events"
  );
};

interface GetEventFollowupQuestionsProps extends InfiniteQueryParams {
  eventId: string;
  followupId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowupQuestions = async ({
  eventId,
  followupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFollowupQuestionsProps): Promise<
  ConnectedXMResponse<RegistrationFollowupQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}/questions`,
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
export const useGetEventFollowupQuestions = (
  eventId: string = "",
  followupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFollowupQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFollowupQuestions>>
  >(
    EVENT_FOLLOWUP_QUESTIONS_QUERY_KEY(eventId, followupId),
    (params: InfiniteQueryParams) =>
      GetEventFollowupQuestions({
        ...params,
        eventId,
        followupId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!followupId && (options.enabled ?? true),
    },
    "events"
  );
};
