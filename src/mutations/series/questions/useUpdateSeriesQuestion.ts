import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SeriesQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesQuestionUpdateInputs } from "@src/params";
import {
  SERIES_QUESTIONS_QUERY_KEY,
  SET_SERIES_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface UpdateSeriesQuestionParams extends MutationParams {
  seriesId: string;
  questionId: string;
  question: SeriesQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const UpdateSeriesQuestion = async ({
  seriesId,
  questionId,
  question,
  adminApiParams,
  queryClient,
}: UpdateSeriesQuestionParams): Promise<
  ConnectedXMResponse<SeriesQuestion>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SeriesQuestion>
  >(`/series/${seriesId}/questions/${questionId}`, {
    ...question,
    id: undefined,
    seriesId: undefined,
    choices: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTIONS_QUERY_KEY(seriesId),
    });
    SET_SERIES_QUESTION_QUERY_DATA(
      queryClient,
      [seriesId, questionId || data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useUpdateSeriesQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesQuestion>>,
      Omit<UpdateSeriesQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesQuestionParams,
    Awaited<ReturnType<typeof UpdateSeriesQuestion>>
  >(UpdateSeriesQuestion, options);
};
