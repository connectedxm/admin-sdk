import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionSearchValue } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "./useGetEventQuestionSearchValues";
import {
  useConnectedSingleQuery,
  SingleQueryParams,
  SingleQueryOptions,
} from "../../useConnectedSingleQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY = (
  eventId: string,
  questionId: string,
  searchValueId: string
) => [
  ...EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
  searchValueId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_SEARCH_VALUE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSearchValue>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSearchValueProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestionSearchValue = async ({
  eventId,
  questionId,
  searchValueId,
  adminApiParams,
}: GetEventQuestionSearchValueProps): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/values/${searchValueId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventQuestionSearchValue = (
  eventId: string = "",
  questionId: string = "",
  searchValueId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionSearchValue>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventQuestionSearchValue>
  >(
    EVENT_QUESTION_SEARCH_VALUE_QUERY_KEY(eventId, questionId, searchValueId),
    (params: SingleQueryParams) =>
      GetEventQuestionSearchValue({
        eventId,
        questionId,
        searchValueId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!questionId &&
        !!searchValueId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
