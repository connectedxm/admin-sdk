import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  SURVEY_SUBMISSION_QUERY_KEY,
  SURVEY_SUBMISSIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey
 */
export interface DeleteSurveySubmissionParams extends MutationParams {
  surveyId: string;
  submissionId: string;
}

/**
 * @category Methods
 * @group Survey
 */
export const DeleteSurveySubmission = async ({
  surveyId,
  submissionId,
  adminApiParams,
  queryClient,
}: DeleteSurveySubmissionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/submissions/${submissionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SUBMISSIONS_QUERY_KEY(surveyId),
    });
    queryClient.removeQueries({
      queryKey: SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey
 */
export const useDeleteSurveySubmission = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveySubmission>>,
      Omit<DeleteSurveySubmissionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveySubmissionParams,
    Awaited<ReturnType<typeof DeleteSurveySubmission>>
  >(DeleteSurveySubmission, options);
};
