import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY,
  CUSTOM_MODULE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteCustomModuleTranslationParams extends MutationParams {
  moduleId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteCustomModuleTranslation = async ({
  moduleId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteCustomModuleTranslationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/modules/custom/${moduleId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY(moduleId),
    });
    queryClient.removeQueries({
      queryKey: CUSTOM_MODULE_TRANSLATION_QUERY_KEY(moduleId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteCustomModuleTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteCustomModuleTranslation>>,
      Omit<
        DeleteCustomModuleTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteCustomModuleTranslationParams,
    Awaited<ReturnType<typeof DeleteCustomModuleTranslation>>
  >(DeleteCustomModuleTranslation, options);
};
