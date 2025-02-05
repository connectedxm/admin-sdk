import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SponsorshipLevelTranslation,
} from "@src/interfaces";
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
 * Creates a new translation for a specific sponsorship level.
 * This function allows the creation of a translation for a given level ID and locale, with an optional auto-translation feature.
 * It is used to manage multilingual support for sponsorship levels within the application.
 * @name PostLevelTranslation
 * @param {string} levelId - The ID of the level to translate
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the content
 * @version 1.2
 **/

/**
 * @category Params
 * @group Level-Translations
 */
export interface CreateLevelTranslationParams extends MutationParams {
  levelId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Level-Translations
 */
export const CreateLevelTranslation = async ({
  levelId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateLevelTranslationParams): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<SponsorshipLevelTranslation>
  >(`/levels/${levelId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LEVEL_TRANSLATIONS_QUERY_KEY(levelId),
    });

    SET_LEVEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [levelId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Level-Translations
 */
export const useCreateLevelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateLevelTranslation>>,
      Omit<CreateLevelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateLevelTranslationParams,
    Awaited<ReturnType<typeof CreateLevelTranslation>>
  >(CreateLevelTranslation, options, {
    domain: "sponsors",
    type: "update",
  });
};