import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUERY_KEY } from "../useGetSurvey";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_TRANSLATIONS_QUERY_KEY = (surveyId: string) => [
  ...SURVEY_QUERY_KEY(surveyId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyTranslations>>
) => {
  client.setQueryData(SURVEY_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetSurveyTranslationsProps extends InfiniteQueryParams {
  surveyId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  surveyId,
  adminApiParams,
}: GetSurveyTranslationsProps): Promise<
  ConnectedXMResponse<SurveyTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys/${surveyId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyTranslations = (
  surveyId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyTranslations>>
  >(
    SURVEY_TRANSLATIONS_QUERY_KEY(surveyId),
    (params: InfiniteQueryParams) =>
      GetSurveyTranslations({
        ...params,
        surveyId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && (options.enabled ?? true),
    },
    "surveys"
  );
};
