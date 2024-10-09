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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
    domain: "levels",
    type: "update",
  });
};
