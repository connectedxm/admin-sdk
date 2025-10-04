import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveySection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_SECTIONS_QUERY_KEY,
  SET_SURVEY_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface UpdateSurveySectionQuestionParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  questionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const UpdateSurveySectionQuestion = async ({
  surveyId,
  sectionId,
  questionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateSurveySectionQuestionParams): Promise<
  ConnectedXMResponse<SurveySection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SurveySection>>(
    `/surveys/${surveyId}/sections/${sectionId}/questions/${questionId}`,
    {
      sortOrder,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_SECTION_QUERY_DATA(queryClient, [surveyId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useUpdateSurveySectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySectionQuestion>>,
      Omit<UpdateSurveySectionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySectionQuestionParams,
    Awaited<ReturnType<typeof UpdateSurveySectionQuestion>>
  >(UpdateSurveySectionQuestion, options);
};
