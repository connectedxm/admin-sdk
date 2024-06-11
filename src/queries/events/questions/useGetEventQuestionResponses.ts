import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionResponse } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";

export const EVENT_QUESTION_RESPONSES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "RESPONSES"];

export const SET_EVENT_QUESTION_RESPONSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionResponses>>
) => {
  client.setQueryData(
    EVENT_QUESTION_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionResponsesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionResponses = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventQuestionResponsesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/responses`,
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

const useGetEventQuestionResponses = (eventId: string, questionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionResponses>>
  >(
    EVENT_QUESTION_RESPONSES_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) => GetEventQuestionResponses(params),
    {
      eventId,
      questionId,
    },
    {
      enabled: !!eventId && !!questionId,
    }
  );
};

export default useGetEventQuestionResponses;
