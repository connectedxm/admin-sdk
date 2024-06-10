import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionTranslation } from "@src/interfaces";
import { EVENT_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventQuestionTranslations";

export const EVENT_QUESTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  questionId: string,
  locale: string
) => [...EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId), locale];

export const SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionTranslation>>
) => {
  client.setQueryData(
    EVENT_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionTranslationProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  locale: string;
}

export const GetEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  adminApiParams,
}: GetEventQuestionTranslationProps): Promise<
  ConnectedXMResponse<RegistrationQuestionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};

const useGetEventQuestionTranslation = (
  eventId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventQuestionTranslation>
  >(
    EVENT_QUESTION_TRANSLATION_QUERY_KEY(eventId, questionId, locale),
    (params: SingleQueryParams) =>
      GetEventQuestionTranslation({
        eventId,
        questionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!questionId && !!locale && (options?.enabled ?? true),
    }
  );
};

export default useGetEventQuestionTranslation;
