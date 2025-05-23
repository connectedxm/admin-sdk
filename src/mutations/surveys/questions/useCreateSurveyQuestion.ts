import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveyQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyQuestionCreateInputs } from "@src/params";
import {
  SURVEY_QUESTION_CHOICES_QUERY_KEY,
  SURVEY_QUESTIONS_QUERY_KEY,
  SET_SURVEY_QUESTION_QUERY_DATA,
} from "@src/queries";
import { SURVEY_SECTION_QUESTIONS_QUERY_KEY } from "@src/queries/surveys/sections/useGetSurveySectionQuestions";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface CreateSurveyQuestionParams extends MutationParams {
  surveyId: string;
  question: SurveyQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const CreateSurveyQuestion = async ({
  surveyId,
  question,
  adminApiParams,
  queryClient,
}: CreateSurveyQuestionParams): Promise<
  ConnectedXMResponse<SurveyQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SurveyQuestion>>(
    `/surveys/${surveyId}/questions`,
    question
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_QUESTION_QUERY_DATA(
      queryClient,
      [surveyId, data.data.id.toString()],
      data
    );
    if (question.sectionId) {
      queryClient.invalidateQueries({
        queryKey: SURVEY_SECTION_QUESTIONS_QUERY_KEY(
          surveyId,
          question.sectionId.toString()
        ),
      });
    }

    if (question.questionId) {
      queryClient.invalidateQueries({
        queryKey: SURVEY_QUESTION_CHOICES_QUERY_KEY(
          surveyId,
          question.questionId.toString()
        ),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useCreateSurveyQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveyQuestion>>,
      Omit<CreateSurveyQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyQuestionParams,
    Awaited<ReturnType<typeof CreateSurveyQuestion>>
  >(CreateSurveyQuestion, options, {
    domain: "surveys",
    type: "update",
  });
};
