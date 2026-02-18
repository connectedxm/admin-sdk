import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SERIES_TRANSLATIONS_QUERY_KEY,
  SERIES_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Series-Translations
 */
export interface DeleteSeriesTranslationParams extends MutationParams {
  seriesId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Series-Translations
 */
export const DeleteSeriesTranslation = async ({
  seriesId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteSeriesTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/series/${seriesId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_TRANSLATIONS_QUERY_KEY(seriesId),
    });
    queryClient.invalidateQueries({
      queryKey: SERIES_TRANSLATION_QUERY_KEY(seriesId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Series-Translations
 */
export const useDeleteSeriesTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSeriesTranslation>>,
      Omit<DeleteSeriesTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSeriesTranslationParams,
    Awaited<ReturnType<typeof DeleteSeriesTranslation>>
  >(DeleteSeriesTranslation, options);
};
