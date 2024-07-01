import { GetAdminAPI } from "@src/AdminAPI";
import { PageType, PageTranslation } from "@src/interfaces";
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
 * @category Params
 * @group Organization-Pages-Translations
 */
export interface UpdateOrganizationPageTranslationParams
  extends MutationParams {
  type: PageType;
  pageTranslation: PageTranslation;
}

/**
 * @category Methods
 * @group Organization-Pages-Translations
 */
export const UpdateOrganizationPageTranslation = async ({
  type,
  pageTranslation,
  adminApiParams,
  queryClient,
}: UpdateOrganizationPageTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = pageTranslation;

  const { data } = await connectedXM.put(
    `/organization/pages/${type}/translations/${locale}`,
    body
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
  >(UpdateOrganizationPageTranslation, options);
};
