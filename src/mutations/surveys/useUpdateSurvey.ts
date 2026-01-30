import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SURVEYS_QUERY_KEY, SET_SURVEY_QUERY_DATA } from "@src/queries";
import { ConnectedXMResponse, Survey } from "@src/interfaces";
import { SurveyUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Survey
 */
export interface UpdateSurveyParams extends MutationParams {
  surveyId: string;
  survey: SurveyUpdateInputs;
}

/**
 * @category Methods
 * @group Survey
 */
export const UpdateSurvey = async ({
  surveyId,
  survey,
  adminApiParams,
  queryClient,
}: UpdateSurveyParams): Promise<ConnectedXMResponse<Survey>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Survey>>(
    `/surveys/${surveyId}`,
    survey
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY() });
    SET_SURVEY_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey
 */
export const useUpdateSurvey = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurvey>>,
      Omit<UpdateSurveyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyParams,
    Awaited<ReturnType<typeof UpdateSurvey>>
  >(UpdateSurvey, options);
};
