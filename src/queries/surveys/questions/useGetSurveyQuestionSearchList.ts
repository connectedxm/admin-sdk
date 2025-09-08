import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SearchList } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Survey-Question-SearchList
 */
export const SURVEY_QUESTION_SEARCHLIST_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => ["SURVEY_QUESTION_SEARCHLIST", surveyId, questionId];

/**
 * @category Setters
 * @group Survey-Question-SearchList
 */
export const SET_SURVEY_QUESTION_SEARCHLIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_SEARCHLIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionSearchList>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_SEARCHLIST_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionSearchListProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Survey-Question-SearchList
 */
export const GetSurveyQuestionSearchList = async ({
  surveyId,
  questionId,
  adminApiParams,
}: GetSurveyQuestionSearchListProps): Promise<
  ConnectedXMResponse<SearchList>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/searchlist`
  );
  return data;
};
/**
 * @category Hooks
 * @group Survey-Question-SearchList
 */
export const useGetSurveyQuestionSearchList = (
  surveyId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveyQuestionSearchList>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveyQuestionSearchList>
  >(
    SURVEY_QUESTION_SEARCHLIST_QUERY_KEY(surveyId, questionId),
    (params: SingleQueryParams) =>
      GetSurveyQuestionSearchList({ surveyId, questionId, ...params }),
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options?.enabled ?? true),
    },
    "surveys"
  );
};
