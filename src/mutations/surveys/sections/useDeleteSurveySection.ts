import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_SECTIONS_QUERY_KEY,
  SURVEY_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface DeleteSurveySectionParams extends MutationParams {
  surveyId: string;
  sectionId: string;
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const DeleteSurveySection = async ({
  surveyId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteSurveySectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/sections/${sectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTIONS_QUERY_KEY(surveyId),
    });
    queryClient.removeQueries({
      queryKey: SURVEY_SECTION_QUERY_KEY(surveyId, sectionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useDeleteSurveySection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveySection>>,
      Omit<DeleteSurveySectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveySectionParams,
    Awaited<ReturnType<typeof DeleteSurveySection>>
  >(DeleteSurveySection, options, {
    domain: "surveys",
    type: "update",
  });
};
