import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionSearchValue } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "CHOICES"];

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

export const GetEventQuestionSearchValues = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetEventQuestionSearchValues = (
  eventId: string,
  questionId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
  >(
    EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    (params: any) => GetEventQuestionSearchValues(params),
    {
      eventId,
      questionId,
    },
    {
      enabled: !!eventId && !!questionId,
    }
  );
};

export default useGetEventQuestionSearchValues;
