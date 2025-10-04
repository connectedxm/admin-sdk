import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Survey } from "@src/interfaces";
import { SURVEYS_QUERY_KEY, SET_SURVEY_QUERY_DATA } from "@src/queries";
import { SurveyCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Survey
 */
export interface CreateSurveyParams extends MutationParams {
  survey: SurveyCreateInputs;
}

/**
 * @category Methods
 * @group Survey
 */
export const CreateSurvey = async ({
  survey,
  adminApiParams,
  queryClient,
}: CreateSurveyParams): Promise<ConnectedXMResponse<Survey>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Survey>>(
    `/surveys`,
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
export const useCreateSurvey = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurvey>>,
      Omit<CreateSurveyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyParams,
    Awaited<ReturnType<typeof CreateSurvey>>
  >(CreateSurvey, options);
};
