import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupTranslation } from "@src/interfaces";
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
export interface CreateGroupTranslationParams extends MutationParams {
  groupId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Groups-Translations
 */
export const CreateGroupTranslation = async ({
  groupId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateGroupTranslationParams): Promise<
  ConnectedXMResponse<GroupTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<GroupTranslation>
  >(`/groups/${groupId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_TRANSLATIONS_QUERY_KEY(groupId),
    });
    SET_GROUP_TRANSLATION_QUERY_DATA(
      queryClient,
      [groupId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups-Translations
 */
export const useCreateGroupTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateGroupTranslation>>,
      Omit<CreateGroupTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupTranslationParams,
    Awaited<ReturnType<typeof CreateGroupTranslation>>
  >(CreateGroupTranslation, options);
};
