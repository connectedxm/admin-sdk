import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoiceTranslation } from "@src/interfaces";
import { EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "./useGetEventQuestionChoiceTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string,
  locale: string
) => [
  ...EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
    eventId,
    questionId,
    choiceId
  ),
  locale,
];

export const SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoiceTranslation>>
) => {
  client.setQueryData(
    EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionChoiceTranslationProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

export const GetEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
}: GetEventQuestionChoiceTranslationProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );
  return data;
};

const useGetEventQuestionChoiceTranslation = (
  eventId: string = "",
  questionId: string = "",
  choiceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionChoiceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventQuestionChoiceTranslation>
  >(
    EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
      eventId,
      questionId,
      choiceId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventQuestionChoiceTranslation({
        eventId,
        questionId,
        choiceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!questionId && !!choiceId && !!locale,
    }
  );
};

export default useGetEventQuestionChoiceTranslation;
