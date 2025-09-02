import { ConnectedXMResponse } from "@src/interfaces";
import { SearchListValue } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Event-Question-SearchList-Values
 */
export const EVENT_QUESTION_SEARCHLIST_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => ["EVENT_QUESTION_SEARCHLIST_VALUES", eventId, questionId];

/**
 * @category Setters
 * @group Event-Question-SearchList-Values
 */
export const SET_EVENT_QUESTION_SEARCHLIST_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SEARCHLIST_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSearchListValues>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SEARCHLIST_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSearchListValuesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Event-Question-SearchList-Values
 */
export const GetEventQuestionSearchListValues = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventQuestionSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/searchlist/values`,
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
 * @group Event-Question-SearchList-Values
 */
export const useGetEventQuestionSearchListValues = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSearchListValues>>
  >(
    EVENT_QUESTION_SEARCHLIST_VALUES_QUERY_KEY(eventId, questionId),
    (queryParams: InfiniteQueryParams) =>
      GetEventQuestionSearchListValues({ eventId, questionId, ...queryParams }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options?.enabled ?? true),
    },
    "events"
  );
};
