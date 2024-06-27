import { GetAdminAPI } from "@src/AdminAPI";
import { GroupTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  GROUP_TRANSLATIONS_QUERY_KEY,
  SET_GROUP_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Groups-Translations
 */
export interface UpdateGroupTranslationParams extends MutationParams {
  groupId: string;
  groupTranslation: GroupTranslation;
}

/**
 * @category Methods
 * @group Groups-Translations
 */
export const UpdateGroupTranslation = async ({
  groupId,
  groupTranslation,
  queryClient,
  adminApiParams,
}: UpdateGroupTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = groupTranslation;

  const { data } = await connectedXM.put(
    `/groups/${groupId}/translations/${locale}`,
    body
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_TRANSLATIONS_QUERY_KEY(groupId),
    });
    SET_GROUP_TRANSLATION_QUERY_DATA(
      queryClient,
      [groupId, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups-Translations
 */
export const useUpdateGroupTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateGroupTranslation>>,
      Omit<UpdateGroupTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateGroupTranslationParams,
    Awaited<ReturnType<typeof UpdateGroupTranslation>>
  >(UpdateGroupTranslation, options);
};
