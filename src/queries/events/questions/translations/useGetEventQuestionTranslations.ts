import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "../useGetEventQuestion";

export const EVENT_QUESTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "TRANSLATIONS"];

export const SET_EVENT_QUESTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionTranslations>>
) => {
  client.setQueryData(
    EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  questionId,
}: GetEventQuestionTranslationsProps): Promise<
  ConnectedXMResponse<RegistrationQuestionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/translations`,
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

const useGetEventQuestionTranslations = (
  eventId: string,
  questionId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionTranslations>>
  >(
    EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) => GetEventQuestionTranslations(params),
    {
      eventId,
      questionId,
    },
    {
      enabled: !!eventId && !!questionId,
    }
  );
};

export default useGetEventQuestionTranslations;
