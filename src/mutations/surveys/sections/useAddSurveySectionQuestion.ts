import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveySection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_SECTION_QUESTIONS_QUERY_KEY,
  SET_SURVEY_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface AddSurveySectionQuestionParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const AddSurveySectionQuestion = async ({
  surveyId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: AddSurveySectionQuestionParams): Promise<
  ConnectedXMResponse<SurveySection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SurveySection>>(
    `/surveys/${surveyId}/sections/${sectionId}/questions/${questionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTION_QUESTIONS_QUERY_KEY(surveyId, sectionId),
    });
    SET_SURVEY_SECTION_QUERY_DATA(queryClient, [surveyId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useAddSurveySectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddSurveySectionQuestion>>,
      Omit<AddSurveySectionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSurveySectionQuestionParams,
    Awaited<ReturnType<typeof AddSurveySectionQuestion>>
  >(AddSurveySectionQuestion, options, {
    domain: "surveys",
    type: "update",
  });
};
