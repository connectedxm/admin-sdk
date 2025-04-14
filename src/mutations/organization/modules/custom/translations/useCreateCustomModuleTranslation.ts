import { CustomModuleTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY,
  SET_CUSTOM_MODULE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Organization
 */
export interface CreateCustomModuleTranslationParams extends MutationParams {
  moduleId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Organization
 */
export const CreateCustomModuleTranslation = async ({
  moduleId,
  locale,
  autoTranslate = true,
  adminApiParams,
  queryClient,
}: CreateCustomModuleTranslationParams): Promise<
  ConnectedXMResponse<CustomModuleTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<CustomModuleTranslation>
  >(`/organization/modules/custom/${moduleId}/translations`, {
    locale,
    autoTranslate,
  });
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
export const useCreateCustomModuleTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateCustomModuleTranslation>>,
      Omit<
        CreateCustomModuleTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCustomModuleTranslationParams,
    Awaited<ReturnType<typeof CreateCustomModuleTranslation>>
  >(CreateCustomModuleTranslation, options, {
    domain: "org",
    type: "create",
  });
};
