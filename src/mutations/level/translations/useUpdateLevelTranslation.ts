import { GetAdminAPI } from "@src/AdminAPI";
import { SponsorshipLevelTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
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
  levelTranslation: SponsorshipLevelTranslation;
}

/**
 * @category Methods
 * @group Level-Translations
 */
export const UpdateLevelTranslation = async ({
  levelId,
  levelTranslation,
  adminApiParams,
  queryClient,
}: UpdateLevelTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = levelTranslation;

  const { data } = await connectedXM.put(
    `/levels/${levelId}/translations/${locale}`,
    body
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
