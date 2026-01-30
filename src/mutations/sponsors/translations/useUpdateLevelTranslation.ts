import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { LevelTranslationUpdateInputs } from "@src/params";
import {
  LEVEL_TRANSLATIONS_QUERY_KEY,
  SET_LEVEL_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Level-Translations
 */
export interface UpdateLevelTranslationParams extends MutationParams {
  levelId: string;
  locale: ISupportedLocale;
  levelTranslation: LevelTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Level-Translations
 */
export const UpdateLevelTranslation = async ({
  levelId,
  levelTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateLevelTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/levels/${levelId}/translations/${locale}`,
    levelTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LEVEL_TRANSLATIONS_QUERY_KEY(levelId),
    });
    SET_LEVEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [levelId, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Level-Translations
 */
export const useUpdateLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateLevelTranslation>>,
      Omit<UpdateLevelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateLevelTranslationParams,
    Awaited<ReturnType<typeof UpdateLevelTranslation>>
  >(UpdateLevelTranslation, options);
};
