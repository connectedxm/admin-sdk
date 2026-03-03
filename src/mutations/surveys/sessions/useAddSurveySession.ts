import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Survey } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SURVEY_SESSIONS_QUERY_KEY, SET_SURVEY_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Survey-Sessions
 */
export interface AddSurveySessionParams extends MutationParams {
  surveyId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Survey-Sessions
 */
export const AddSurveySession = async ({
  surveyId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddSurveySessionParams): Promise<ConnectedXMResponse<Survey>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Survey>>(
    `/surveys/${surveyId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SESSIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_QUERY_DATA(queryClient, [surveyId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sessions
 */
export const useAddSurveySession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddSurveySession>>,
      Omit<AddSurveySessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSurveySessionParams,
    Awaited<ReturnType<typeof AddSurveySession>>
  >(AddSurveySession, options);
};
