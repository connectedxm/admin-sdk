import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionSearchValue } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "CHOICES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_SEARCH_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSearchValuesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestionSearchValues = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/values`,
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
export const useGetEventQuestionSearchValues = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
  >(
    EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionSearchValues({
        ...params,
        eventId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options.enabled ?? true),
    },
    "events"
  );
};
