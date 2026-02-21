import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SeriesQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesQuestionCreateInputs } from "@src/params";
import {
  SERIES_QUESTIONS_QUERY_KEY,
  SET_SERIES_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series
 */
export interface CreateSeriesQuestionParams extends MutationParams {
  seriesId: string;
  question: SeriesQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Series
 */
export const CreateSeriesQuestion = async ({
  seriesId,
  question,
  adminApiParams,
  queryClient,
}: CreateSeriesQuestionParams): Promise<
  ConnectedXMResponse<SeriesQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SeriesQuestion>
  >(`/series/${seriesId}/questions`, question);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_QUESTIONS_QUERY_KEY(seriesId),
    });
    SET_SERIES_QUESTION_QUERY_DATA(
      queryClient,
      [seriesId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series
 */
export const useCreateSeriesQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSeriesQuestion>>,
      Omit<CreateSeriesQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSeriesQuestionParams,
    Awaited<ReturnType<typeof CreateSeriesQuestion>>
  >(CreateSeriesQuestion, options);
};
