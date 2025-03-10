import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SURVEYS_QUERY_KEY, SURVEY_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Survey
 */
export interface DeleteSurveyParams extends MutationParams {
  surveyId: string;
}

/**
 * @category Methods
 * @group Survey
 */
export const DeleteSurvey = async ({
  surveyId,
  adminApiParams,
  queryClient,
}: DeleteSurveyParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: SURVEY_QUERY_KEY(surveyId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey
 */
export const useDeleteSurvey = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurvey>>,
      Omit<DeleteSurveyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyParams,
    Awaited<ReturnType<typeof DeleteSurvey>>
  >(DeleteSurvey, options, {
    domain: "surveys",
    type: "del",
  });
};
