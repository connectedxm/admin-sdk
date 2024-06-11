import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "../useGetEventQuestion";
import { GetAdminAPI } from "@src/AdminAPI";

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
  adminApiParams,
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
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionTranslations>>
  >(
    EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionTranslations({
        ...params,
        eventId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options.enabled ?? true),
    }
  );
};

export default useGetEventQuestionTranslations;
