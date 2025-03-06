import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SURVEY_QUESTION_RESPONSES_QUERY_KEY } from "@src/queries";
import { SURVEY_QUESTION_SECTIONS_QUERY_KEY } from "@src/queries/surveys/submissions/useGetSurveySubmissionQuestionSections";

/**
 * @category Params
 * @group Survey
 */
export interface UpdateSurveySubmissionResponsesParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  questions: { questionId: string; value: string }[];
}

/**
 * @category Methods
 * @group Survey
 */
export const UpdateSurveySubmissionResponses = async ({
  surveyId,
  submissionId,
  questions,
  adminApiParams,
  queryClient,
}: UpdateSurveySubmissionResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/surveys/${surveyId}/submissions/${submissionId}/responses`,
    questions
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_RESPONSES_QUERY_KEY(surveyId, submissionId),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_SECTIONS_QUERY_KEY(surveyId, submissionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey
 */
export const useUpdateSurveySubmissionResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySubmissionResponses>>,
      Omit<
        UpdateSurveySubmissionResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySubmissionResponsesParams,
    Awaited<ReturnType<typeof UpdateSurveySubmissionResponses>>
  >(UpdateSurveySubmissionResponses, options, {
    domain: "surveys",
    type: "update",
  });
};
