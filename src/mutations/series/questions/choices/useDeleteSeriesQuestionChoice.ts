import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SERIES_QUESTION_CHOICES_QUERY_KEY,
  SERIES_QUESTION_CHOICE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface DeleteSeriesQuestionChoiceParams extends MutationParams {
  seriesId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const DeleteSeriesQuestionChoice = async ({
  seriesId,
  questionId,
  choiceId,
  adminApiParams,
  queryClient,
}: DeleteSeriesQuestionChoiceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/series/${seriesId}/questions/${questionId}/choices/${choiceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTION_CHOICES_QUERY_KEY(seriesId, questionId),
    });
    queryClient.removeQueries({
      queryKey: SERIES_QUESTION_CHOICE_QUERY_KEY(seriesId, questionId, choiceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useDeleteSeriesQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSeriesQuestionChoice>>,
      Omit<DeleteSeriesQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSeriesQuestionChoiceParams,
    Awaited<ReturnType<typeof DeleteSeriesQuestionChoice>>
  >(DeleteSeriesQuestionChoice, options);
};
