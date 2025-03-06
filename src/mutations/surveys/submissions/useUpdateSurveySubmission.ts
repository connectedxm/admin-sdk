import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, SurveySubmission } from "@src/interfaces";
import { SurveySubmissionUpdateInputs } from "@src/params";
import {
  SET_SURVEY_SUBMISSION_QUERY_DATA,
  SURVEY_SUBMISSIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey
 */
export interface UpdateSurveySubmissionParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  submission: SurveySubmissionUpdateInputs;
}

/**
 * @category Methods
 * @group Survey
 */
export const UpdateSurveySubmission = async ({
  surveyId,
  submissionId,
  submission,
  adminApiParams,
  queryClient,
}: UpdateSurveySubmissionParams): Promise<
  ConnectedXMResponse<SurveySubmission>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SurveySubmission>>(
    `/surveys/${surveyId}/submissions/${submissionId}`,
    submission
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SUBMISSIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_SUBMISSION_QUERY_DATA(
      queryClient,
      [surveyId, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey
 */
export const useUpdateSurveySubmission = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySubmission>>,
      Omit<UpdateSurveySubmissionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySubmissionParams,
    Awaited<ReturnType<typeof UpdateSurveySubmission>>
  >(UpdateSurveySubmission, options, {
    domain: "surveys",
    type: "update",
  });
};
