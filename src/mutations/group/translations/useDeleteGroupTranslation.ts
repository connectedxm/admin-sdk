import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  GROUP_TRANSLATIONS_QUERY_KEY,
  GROUP_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Groups-Translations
 */
export interface DeleteGroupTranslationParams extends MutationParams {
  groupId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Groups-Translations
 */
export const DeleteGroupTranslation = async ({
  groupId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteGroupTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/groups/${groupId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_TRANSLATIONS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_TRANSLATION_QUERY_KEY(groupId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups-Translations
 */
export const useDeleteGroupTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteGroupTranslation>>,
      Omit<DeleteGroupTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteGroupTranslationParams,
    Awaited<ReturnType<typeof DeleteGroupTranslation>>
  >(DeleteGroupTranslation, options);
};
