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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
