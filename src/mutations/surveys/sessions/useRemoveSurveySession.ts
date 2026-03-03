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
export interface RemoveSurveySessionParams extends MutationParams {
  surveyId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Survey-Sessions
 */
export const RemoveSurveySession = async ({
  surveyId,
  sessionId,
  adminApiParams,
  queryClient,
}: RemoveSurveySessionParams): Promise<ConnectedXMResponse<Survey>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Survey>>(
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
export const useRemoveSurveySession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveSurveySession>>,
      Omit<RemoveSurveySessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSurveySessionParams,
    Awaited<ReturnType<typeof RemoveSurveySession>>
  >(RemoveSurveySession, options);
};
