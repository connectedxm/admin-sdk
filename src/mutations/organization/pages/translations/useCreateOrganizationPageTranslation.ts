import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  PageTranslation,
  PageType,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY,
  SET_ORGANIZATION_PAGE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific organization page.
 * This function allows for the creation of translations for organization pages, supporting optional auto-translation.
 * It is designed to be used in applications where multilingual support for organization pages is required.
 * @name PostOrganizationPageTranslation
 * @param {PageType} type - The type of the page
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the page
 * @version 1.2
 **/

/**
 * @category Params
 * @group Organization-Pages-Translations
 */
export interface CreateOrganizationPageTranslationParams
  extends MutationParams {
  type: PageType;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Organization-Pages-Translations
 */
export const CreateOrganizationPageTranslation = async ({
  type,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateOrganizationPageTranslationParams): Promise<
  ConnectedXMResponse<PageTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<PageTranslation>>(
    `/organization/pages/${type}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY(type),
    });
    SET_ORGANIZATION_PAGE_TRANSLATION_QUERY_DATA(
      queryClient,
      [type, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Pages-Translations
 */
export const useCreateOrganizationPageTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateOrganizationPageTranslation>>,
      Omit<
        CreateOrganizationPageTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateOrganizationPageTranslationParams,
    Awaited<ReturnType<typeof CreateOrganizationPageTranslation>>
  >(CreateOrganizationPageTranslation, options, {
    domain: "org",
    type: "update",
  });
};