import { GetAdminAPI } from "@src/AdminAPI";
import { SurveySection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveySectionUpdateInputs } from "@src/params";
import {
  SURVEY_SECTIONS_QUERY_KEY,
  SET_SURVEY_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface UpdateSurveySectionParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  section: SurveySectionUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const UpdateSurveySection = async ({
  surveyId,
  sectionId,
  section,
  adminApiParams,
  queryClient,
}: UpdateSurveySectionParams): Promise<ConnectedXMResponse<SurveySection>> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<SurveySection>>(
    `/surveys/${surveyId}/sections/${sectionId}`,
    {
      ...section,
      id: undefined,
      surveyId: undefined,
      questions: undefined,
      surveyTickets: undefined,
      accountTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_SECTION_QUERY_DATA(
      queryClient,
      [surveyId, sectionId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useUpdateSurveySection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySection>>,
      Omit<UpdateSurveySectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySectionParams,
    Awaited<ReturnType<typeof UpdateSurveySection>>
  >(UpdateSurveySection, options);
};
