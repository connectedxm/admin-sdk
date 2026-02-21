import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SeriesQuestionTranslation } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import { SERIES_QUESTION_QUERY_KEY } from "../useGetSeriesQuestion";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_QUESTION_TRANSLATION_QUERY_KEY = (
  seriesId: string,
  questionId: string,
  locale: string
) => [...SERIES_QUESTION_QUERY_KEY(seriesId, questionId), "TRANSLATION", locale];

interface GetSeriesQuestionTranslationProps extends SingleQueryParams {
  seriesId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesQuestionTranslation = async ({
  seriesId,
  questionId,
  locale,
  adminApiParams,
}: GetSeriesQuestionTranslationProps): Promise<
  ConnectedXMResponse<SeriesQuestionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesQuestionTranslation = (
  seriesId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSeriesQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSeriesQuestionTranslation>
  >(
    SERIES_QUESTION_TRANSLATION_QUERY_KEY(seriesId, questionId, locale),
    (params: SingleQueryParams) =>
      GetSeriesQuestionTranslation({
        seriesId,
        questionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!seriesId &&
        !!questionId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};
