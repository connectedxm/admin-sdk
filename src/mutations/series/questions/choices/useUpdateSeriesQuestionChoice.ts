import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SeriesQuestionChoice,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesQuestionChoiceUpdateInputs } from "@src/params";
import {
  SERIES_QUESTION_CHOICES_QUERY_KEY,
  SET_SERIES_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface UpdateSeriesQuestionChoiceParams extends MutationParams {
  seriesId: string;
  questionId: string;
  choiceId: string;
  choice: SeriesQuestionChoiceUpdateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const UpdateSeriesQuestionChoice = async ({
  seriesId,
  questionId,
  choiceId,
  choice,
  adminApiParams,
  queryClient,
}: UpdateSeriesQuestionChoiceParams): Promise<
  ConnectedXMResponse<SeriesQuestionChoice>
> => {
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SeriesQuestionChoice>
  >(`/series/${seriesId}/questions/${questionId}/choices/${choiceId}`, {
    ...choice,
    id: undefined,
    questionId: undefined,
    question: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTION_CHOICES_QUERY_KEY(seriesId, questionId),
    });
    SET_SERIES_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [seriesId, questionId, choiceId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useUpdateSeriesQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesQuestionChoice>>,
      Omit<UpdateSeriesQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesQuestionChoiceParams,
    Awaited<ReturnType<typeof UpdateSeriesQuestionChoice>>
  >(UpdateSeriesQuestionChoice, options);
};
