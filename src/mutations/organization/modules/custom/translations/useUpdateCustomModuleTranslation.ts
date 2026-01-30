import { CustomModuleTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY,
  SET_CUSTOM_MODULE_TRANSLATION_QUERY_DATA,
} from "@src/queries";
import { CustomModuleTranslationUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateCustomModuleTranslationParams extends MutationParams {
  moduleId: string;
  locale: string;
  translation: CustomModuleTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateCustomModuleTranslation = async ({
  moduleId,
  locale,
  translation,
  adminApiParams,
  queryClient,
}: UpdateCustomModuleTranslationParams): Promise<
  ConnectedXMResponse<CustomModuleTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<CustomModuleTranslation>
  >(
    `/organization/modules/custom/${moduleId}/translations/${locale}`,
    translation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY(moduleId),
    });
    SET_CUSTOM_MODULE_TRANSLATION_QUERY_DATA(
      queryClient,
      [moduleId, locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateCustomModuleTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateCustomModuleTranslation>>,
      Omit<
        UpdateCustomModuleTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateCustomModuleTranslationParams,
    Awaited<ReturnType<typeof UpdateCustomModuleTranslation>>
  >(UpdateCustomModuleTranslation, options);
};
