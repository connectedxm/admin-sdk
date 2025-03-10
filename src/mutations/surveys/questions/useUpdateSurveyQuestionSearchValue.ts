import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SurveyQuestionSearchValue,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyQuestionSearchValueUpdateInputs } from "@src/params";
import {
  SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY,
  SET_SURVEY_QUESTION_SEARCH_VALUE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface UpdateSurveyQuestionSearchValueParams extends MutationParams {
  surveyId: string;
  questionId: string;
  searchValueId: string;
  searchValue: SurveyQuestionSearchValueUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const UpdateSurveyQuestionSearchValue = async ({
  surveyId,
  questionId,
  searchValueId,
  searchValue,
  adminApiParams,
  queryClient,
}: UpdateSurveyQuestionSearchValueParams): Promise<
  ConnectedXMResponse<SurveyQuestionSearchValue>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SurveyQuestionSearchValue>
  >(
    `/surveys/${surveyId}/questions/${questionId}/values/${searchValueId}`,
    searchValue
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY(surveyId, questionId),
    });
    SET_SURVEY_QUESTION_SEARCH_VALUE_QUERY_DATA(
      queryClient,
      [surveyId, questionId, searchValueId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useUpdateSurveyQuestionSearchValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyQuestionSearchValue>>,
      Omit<
        UpdateSurveyQuestionSearchValueParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyQuestionSearchValueParams,
    Awaited<ReturnType<typeof UpdateSurveyQuestionSearchValue>>
  >(UpdateSurveyQuestionSearchValue, options, {
    domain: "surveys",
    type: "update",
  });
};
