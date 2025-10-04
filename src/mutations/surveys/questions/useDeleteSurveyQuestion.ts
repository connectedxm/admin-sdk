import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTIONS_QUERY_KEY,
  SURVEY_QUESTION_QUERY_KEY,
  SURVEY_SECTION_QUESTIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface DeleteSurveyQuestionParams extends MutationParams {
  surveyId: string;
  questionId: string;
  sectionId?: string;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const DeleteSurveyQuestion = async ({
  surveyId,
  questionId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteSurveyQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/questions/${questionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTIONS_QUERY_KEY(surveyId),
    });
    queryClient.removeQueries({
      queryKey: SURVEY_QUESTION_QUERY_KEY(surveyId, questionId),
    });
    if (sectionId) {
      queryClient.invalidateQueries({
        queryKey: SURVEY_SECTION_QUESTIONS_QUERY_KEY(surveyId, sectionId),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useDeleteSurveyQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyQuestion>>,
      Omit<DeleteSurveyQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteSurveyQuestion, options);
};
