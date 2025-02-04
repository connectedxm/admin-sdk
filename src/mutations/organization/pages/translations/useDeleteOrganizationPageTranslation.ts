import { GetAdminAPI } from "@src/AdminAPI";
import { PageType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY,
  ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation of an organization's page based on the provided type and locale.
 * This function is used to remove translations for organization pages, ensuring that outdated or incorrect translations can be managed effectively.
 * It also handles cache invalidation for the related queries to ensure data consistency.
 * @name DeleteOrganizationPageTranslation
 * @param {PageType} type - The type of the page
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Organization-Pages-Translations
 */
export interface DeleteOrganizationPageTranslationParams
  extends MutationParams {
  type: PageType;
  locale: string;
}

/**
 * @category Methods
 * @group Organization-Pages-Translations
 */
export const DeleteOrganizationPageTranslation = async ({
  type,
  locale,
  adminApiParams,
  queryClient,
}: DeleteOrganizationPageTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/organization/pages/${type}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY(type),
    });
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY(type, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Pages-Translations
 */
export const useDeleteOrganizationPageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationPageTranslation>>,
      Omit<
        DeleteOrganizationPageTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationPageTranslationParams,
    Awaited<ReturnType<typeof DeleteOrganizationPageTranslation>>
  >(DeleteOrganizationPageTranslation, options, {
    domain: "org",
    type: "update",
  });
};