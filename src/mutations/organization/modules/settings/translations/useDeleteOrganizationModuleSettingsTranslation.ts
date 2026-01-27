import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY,
  ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Organization-Module-Settings-Translations
 */
export interface DeleteOrganizationModuleSettingsTranslationParams
  extends MutationParams {
  locale: string;
}

/**
 * @category Methods
 * @group Organization-Module-Settings-Translations
 */
export const DeleteOrganizationModuleSettingsTranslation = async ({
  locale,
  adminApiParams,
  queryClient,
}: DeleteOrganizationModuleSettingsTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/organization/module-settings/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_KEY(locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Module-Settings-Translations
 */
export const useDeleteOrganizationModuleSettingsTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationModuleSettingsTranslation>>,
      Omit<
        DeleteOrganizationModuleSettingsTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationModuleSettingsTranslationParams,
    Awaited<ReturnType<typeof DeleteOrganizationModuleSettingsTranslation>>
  >(DeleteOrganizationModuleSettingsTranslation, options);
};
