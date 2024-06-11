import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoiceTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_CHOICE_QUERY_KEY } from "../useGetEventQuestionChoice";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string
) => [
  ...EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_DATA = (
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

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestionChoiceTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  questionId,
  choiceId,
  adminApiParams,
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
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventQuestionChoiceTranslations = (
  eventId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
  >(
    EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(eventId, questionId, choiceId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionChoiceTranslations({
        ...params,
        eventId,
        questionId,
        choiceId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!questionId && !!choiceId && (options.enabled ?? true),
    }
  );
};
