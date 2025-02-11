import { GetAdminAPI } from "@src/AdminAPI";
import { PageType, ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { OrganizationPageTranslationUpdateInputs } from "@src/params";
import {
  ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY,
  SET_ORGANIZATION_PAGE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific organization page for a given locale.
 * This function allows for updating the translation details of an organization's page,
 * identified by the page type and locale. It is useful for applications that need to
 * manage multilingual content for organization pages.
 * @name PutOrganizationPageTranslation
 * @param {PageType} type (path) The type of the page to be translated
 * @param {OrganizationPageTranslationUpdateInputs} pageTranslation (body) The translation details to update
 * @param {ISupportedLocale} locale (path) The locale for which the translation is being updated
 * @version 1.3
 */
export interface UpdateOrganizationPageTranslationParams
  extends MutationParams {
  type: PageType;
  locale: ISupportedLocale;
  pageTranslation: OrganizationPageTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Organization-Pages-Translations
 */
export const UpdateOrganizationPageTranslation = async ({
  type,
  pageTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateOrganizationPageTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/organization/pages/${type}/translations/${locale}`,
    pageTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY(type),
    });
    SET_ORGANIZATION_PAGE_TRANSLATION_QUERY_DATA(
      queryClient,
      [type, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Pages-Translations
 */
export const useUpdateOrganizationPageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationPageTranslation>>,
      Omit<
        UpdateOrganizationPageTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationPageTranslationParams,
    Awaited<ReturnType<typeof UpdateOrganizationPageTranslation>>
  >(UpdateOrganizationPageTranslation, options, {
    domain: "org",
    type: "update",
  });
};
