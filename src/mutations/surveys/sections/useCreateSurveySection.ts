import { GetAdminAPI } from "@src/AdminAPI";
import { SurveySection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveySectionCreateInputs } from "@src/params";
import {
  SURVEY_SECTIONS_QUERY_KEY,
  SET_SURVEY_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface CreateSurveySectionParams extends MutationParams {
  surveyId: string;
  section: SurveySectionCreateInputs;
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const CreateSurveySection = async ({
  surveyId,
  section,
  adminApiParams,
  queryClient,
}: CreateSurveySectionParams): Promise<ConnectedXMResponse<SurveySection>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SurveySection>>(
    `/surveys/${surveyId}/sections`,
    section
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_SECTION_QUERY_DATA(
      queryClient,
      [surveyId, data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useCreateSurveySection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveySection>>,
      Omit<CreateSurveySectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveySectionParams,
    Awaited<ReturnType<typeof CreateSurveySection>>
  >(CreateSurveySection, options);
};
