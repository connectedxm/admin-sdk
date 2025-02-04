import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GroupTranslationUpdateInputs } from "@src/params";
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
  locale: ISupportedLocale;
  groupTranslation: GroupTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Groups-Translations
 */
export const UpdateGroupTranslation = async ({
  groupId,
  groupTranslation,
  locale,
  queryClient,
  adminApiParams,
}: UpdateGroupTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/groups/${groupId}/translations/${locale}`,
    groupTranslation
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
  >(UpdateGroupTranslation, options, {
    domain: "groups",
    type: "update",
  });
};
