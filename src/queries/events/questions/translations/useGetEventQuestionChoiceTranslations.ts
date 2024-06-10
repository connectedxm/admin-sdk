import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  RegistrationQuestion,
  RegistrationQuestionChoiceTranslation,
} from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_QUESTION_CHOICE_QUERY_KEY } from "../useGetEventQuestionChoice";

export const EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string
) => [
  ...EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
  "TRANSLATIONS",
];

export const SET_EVENT_PAGE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
) => {
  client.setQueryData(
    EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionChoiceTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
  choiceId: string;
}

export const GetEventQuestionChoiceTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  questionId,
  choiceId,
}: GetEventQuestionChoiceTranslationsProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations`,
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

const useGetEventQuestionChoiceTranslations = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
  >(
    EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(eventId, questionId, choiceId),
    (params: any) => GetEventQuestionChoiceTranslations(params),
    {
      eventId,
      questionId,
      choiceId,
    },
    {
      enabled: !!eventId && !!questionId && !!choiceId,
    }
  );
};

export default useGetEventQuestionChoiceTranslations;
