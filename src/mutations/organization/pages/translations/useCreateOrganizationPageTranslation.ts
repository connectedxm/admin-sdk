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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<PageTranslation>>(
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
