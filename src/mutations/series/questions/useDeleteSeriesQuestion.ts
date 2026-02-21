import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SERIES_QUESTIONS_QUERY_KEY,
  SERIES_QUESTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface DeleteSeriesQuestionParams extends MutationParams {
  seriesId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Series
 */
export const DeleteSeriesQuestion = async ({
  seriesId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteSeriesQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/series/${seriesId}/questions/${questionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTIONS_QUERY_KEY(seriesId),
    });
    queryClient.removeQueries({
      queryKey: SERIES_QUESTION_QUERY_KEY(seriesId, questionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useDeleteSeriesQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSeriesQuestion>>,
      Omit<DeleteSeriesQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteSeriesQuestion, options);
};
