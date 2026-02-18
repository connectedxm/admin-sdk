import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SeriesTranslationUpdateInputs } from "@src/params";
import {
  SERIES_TRANSLATIONS_QUERY_KEY,
  SET_SERIES_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Series-Translations
 */
export interface UpdateSeriesTranslationParams extends MutationParams {
  seriesId: string;
  locale: ISupportedLocale;
  seriesTranslation: SeriesTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Series-Translations
 */
export const UpdateSeriesTranslation = async ({
  seriesId,
  seriesTranslation,
  adminApiParams,
  locale,
  queryClient,
}: UpdateSeriesTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/series/${seriesId}/translations/${locale}`,
    seriesTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_TRANSLATIONS_QUERY_KEY(seriesId),
    });
    SET_SERIES_TRANSLATION_QUERY_DATA(
      queryClient,
      [seriesId, locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Series-Translations
 */
export const useUpdateSeriesTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesTranslation>>,
      Omit<UpdateSeriesTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesTranslationParams,
    Awaited<ReturnType<typeof UpdateSeriesTranslation>>
  >(UpdateSeriesTranslation, options);
};
