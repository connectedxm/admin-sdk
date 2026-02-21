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
import { SeriesQuestionChoiceCreateInputs } from "@src/params";
import {
  SERIES_QUESTION_CHOICES_QUERY_KEY,
  SET_SERIES_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface CreateSeriesQuestionChoiceParams extends MutationParams {
  seriesId: string;
  questionId: string;
  choice: SeriesQuestionChoiceCreateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const CreateSeriesQuestionChoice = async ({
  seriesId,
  questionId,
  choice,
  adminApiParams,
  queryClient,
}: CreateSeriesQuestionChoiceParams): Promise<
  ConnectedXMResponse<SeriesQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SeriesQuestionChoice>
  >(`/series/${seriesId}/questions/${questionId}/choices`, choice);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTION_CHOICES_QUERY_KEY(seriesId, questionId),
    });
    SET_SERIES_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [seriesId, questionId, data?.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useCreateSeriesQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSeriesQuestionChoice>>,
      Omit<CreateSeriesQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSeriesQuestionChoiceParams,
    Awaited<ReturnType<typeof CreateSeriesQuestionChoice>>
  >(CreateSeriesQuestionChoice, options);
};
