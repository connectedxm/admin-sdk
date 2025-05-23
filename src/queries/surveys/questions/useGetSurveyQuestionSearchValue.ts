import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionSearchValue } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY } from "./useGetSurveyQuestionSearchValues";
import {
  useConnectedSingleQuery,
  SingleQueryParams,
  SingleQueryOptions,
} from "../../useConnectedSingleQuery";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_SEARCH_VALUE_QUERY_KEY = (
  surveyId: string,
  questionId: string,
  searchValueId: string
) => [
  ...SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY(surveyId, questionId),
  searchValueId,
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_SEARCH_VALUE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_SEARCH_VALUE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionSearchValue>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_SEARCH_VALUE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionSearchValueProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
  searchValueId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionSearchValue = async ({
  surveyId,
  questionId,
  searchValueId,
  adminApiParams,
}: GetSurveyQuestionSearchValueProps): Promise<
  ConnectedXMResponse<SurveyQuestionSearchValue>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/values/${searchValueId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyQuestionSearchValue = (
  surveyId: string = "",
  questionId: string = "",
  searchValueId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveyQuestionSearchValue>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveyQuestionSearchValue>
  >(
    SURVEY_QUESTION_SEARCH_VALUE_QUERY_KEY(surveyId, questionId, searchValueId),
    (params: SingleQueryParams) =>
      GetSurveyQuestionSearchValue({
        surveyId,
        questionId,
        searchValueId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!surveyId &&
        !!questionId &&
        !!searchValueId &&
        (options?.enabled ?? true),
    },
    "surveys"
  );
};
