import { GetAdminAPI } from "@src/AdminAPI";
import { SurveySectionQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_SURVEY_SECTION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface ReorderSurveySectionQuestionsParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const ReorderSurveySectionQuestions = async ({
  surveyId,
  sectionId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderSurveySectionQuestionsParams): Promise<
  ConnectedXMResponse<SurveySectionQuestion[]>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<SurveySectionQuestion[]>
  >(`/surveys/${surveyId}/sections/${sectionId}/questions/reorder`, {
    questionIds,
  });

  if (queryClient && data.status === "ok") {
    SET_SURVEY_SECTION_QUESTIONS_QUERY_DATA(
      queryClient,
      [surveyId, sectionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useReorderSurveySectionQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderSurveySectionQuestions>>,
      Omit<
        ReorderSurveySectionQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderSurveySectionQuestionsParams,
    Awaited<ReturnType<typeof ReorderSurveySectionQuestions>>
  >(ReorderSurveySectionQuestions, options, {
    domain: "surveys",
    type: "update",
  });
};
