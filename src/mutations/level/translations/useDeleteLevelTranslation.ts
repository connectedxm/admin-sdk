import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  LEVEL_TRANSLATIONS_QUERY_KEY,
  LEVEL_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific level translation for a given level ID and locale.
 * This function is used to remove translations associated with a level, ensuring that the translation data is no longer available.
 * It is particularly useful in scenarios where outdated or incorrect translations need to be removed from the system.
 * @name DeleteLevelTranslation
 * @param {string} levelId - The ID of the level
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Level-Translations
 */
export interface DeleteLevelTranslationParams extends MutationParams {
  levelId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Level-Translations
 */
export const DeleteLevelTranslation = async ({
  levelId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteLevelTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/levels/${levelId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LEVEL_TRANSLATIONS_QUERY_KEY(levelId),
    });
    queryClient.invalidateQueries({
      queryKey: LEVEL_TRANSLATION_QUERY_KEY(levelId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Level-Translations
 */
export const useDeleteLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteLevelTranslation>>,
      Omit<DeleteLevelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteLevelTranslationParams,
    Awaited<ReturnType<typeof DeleteLevelTranslation>>
  >(DeleteLevelTranslation, options, {
    domain: "sponsors",
    type: "update",
  });
};