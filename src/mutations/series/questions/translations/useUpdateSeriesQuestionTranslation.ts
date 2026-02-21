import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SeriesQuestionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesQuestionTranslationUpdateInputs } from "@src/params";
import {
  SERIES_QUESTION_QUERY_KEY,
  SERIES_QUESTION_TRANSLATION_QUERY_KEY,
  SERIES_QUESTIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface UpdateSeriesQuestionTranslationParams extends MutationParams {
  seriesId: string;
  questionId: string;
  locale: string;
  questionTranslation: SeriesQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const UpdateSeriesQuestionTranslation = async ({
  seriesId,
  questionId,
  locale,
  questionTranslation,
  adminApiParams,
  queryClient,
}: UpdateSeriesQuestionTranslationParams): Promise<
  ConnectedXMResponse<SeriesQuestionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SeriesQuestionTranslation>
  >(
    `/series/${seriesId}/questions/${questionId}/translations/${locale}`,
    questionTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTION_QUERY_KEY(seriesId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTION_TRANSLATION_QUERY_KEY(seriesId, questionId, locale),
    });
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTIONS_QUERY_KEY(seriesId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useUpdateSeriesQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesQuestionTranslation>>,
      Omit<
        UpdateSeriesQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateSeriesQuestionTranslation>>
  >(UpdateSeriesQuestionTranslation, options);
};
