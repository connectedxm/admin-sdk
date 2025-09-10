import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveyQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyQuestionUpdateInputs } from "@src/params";
import {
  SURVEY_QUESTIONS_QUERY_KEY,
  SET_SURVEY_QUESTION_QUERY_DATA,
  SEARCHLIST_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface UpdateSurveyQuestionParams extends MutationParams {
  surveyId: string;
  questionId: string;
  question: SurveyQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const UpdateSurveyQuestion = async ({
  surveyId,
  questionId,
  question,
  adminApiParams,
  queryClient,
}: UpdateSurveyQuestionParams): Promise<
  ConnectedXMResponse<SurveyQuestion>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SurveyQuestion>>(
    `/surveys/${surveyId}/questions/${questionId}`,
    {
      ...question,
      id: undefined,
      surveyId: undefined,
      choices: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTIONS_QUERY_KEY(surveyId),
    });
    // Invalidate searchlist query if searchListId was updated
    if (typeof data.data.searchListId === "string") {
      queryClient.invalidateQueries({
        queryKey: SEARCHLIST_QUERY_KEY(data.data.searchListId),
      });
      // Also invalidate all searchlist values queries to ensure fresh data
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "SEARCHLIST_VALUES";
        },
      });
    }
    SET_SURVEY_QUESTION_QUERY_DATA(
      queryClient,
      [surveyId, questionId || data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useUpdateSurveyQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyQuestion>>,
      Omit<UpdateSurveyQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyQuestionParams,
    Awaited<ReturnType<typeof UpdateSurveyQuestion>>
  >(UpdateSurveyQuestion, options, {
    domain: "surveys",
    type: "update",
  });
};
