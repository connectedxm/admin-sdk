import { GetAdminAPI } from "@src/AdminAPI";
import {
  SeriesQuestionChoice,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_SERIES_QUESTION_CHOICES_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface ReorderSeriesQuestionChoicesParams extends MutationParams {
  seriesId: string;
  questionId: string;
  choicesIds: string[];
}

/**
 * @category Methods
 * @group Series
 */
export const ReorderSeriesQuestionChoices = async ({
  seriesId,
  questionId,
  choicesIds,
  adminApiParams,
  queryClient,
}: ReorderSeriesQuestionChoicesParams): Promise<
  ConnectedXMResponse<SeriesQuestionChoice[]>
> => {
  if (!questionId) throw new Error("Question ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<SeriesQuestionChoice[]>
  >(
    `/series/${seriesId}/questions/${questionId}/choices/reorder`,
    {
      choicesIds,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_SERIES_QUESTION_CHOICES_QUERY_DATA(
      queryClient,
      [seriesId, questionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useReorderSeriesQuestionChoices = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderSeriesQuestionChoices>>,
      Omit<
        ReorderSeriesQuestionChoicesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderSeriesQuestionChoicesParams,
    Awaited<ReturnType<typeof ReorderSeriesQuestionChoices>>
  >(ReorderSeriesQuestionChoices, options);
};
