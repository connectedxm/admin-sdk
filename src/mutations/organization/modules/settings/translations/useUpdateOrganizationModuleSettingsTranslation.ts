import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { OrganizationModuleSettingsTranslationUpdateInputs } from "@src/params";
import {
  ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY,
  SET_ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Organization-Module-Settings-Translations
 */
export interface UpdateOrganizationModuleSettingsTranslationParams
  extends MutationParams {
  locale: ISupportedLocale;
  translation: OrganizationModuleSettingsTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Organization-Module-Settings-Translations
 */
export const UpdateOrganizationModuleSettingsTranslation = async ({
  translation,
  adminApiParams,
  locale,
  queryClient,
}: UpdateOrganizationModuleSettingsTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/organization/module-settings/translations/${locale}`,
    translation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY(),
    });
    SET_ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_DATA(
      queryClient,
      [locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Module-Settings-Translations
 */
export const useUpdateOrganizationModuleSettingsTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationModuleSettingsTranslation>>,
      Omit<
        UpdateOrganizationModuleSettingsTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationModuleSettingsTranslationParams,
    Awaited<ReturnType<typeof UpdateOrganizationModuleSettingsTranslation>>
  >(UpdateOrganizationModuleSettingsTranslation, options);
};
