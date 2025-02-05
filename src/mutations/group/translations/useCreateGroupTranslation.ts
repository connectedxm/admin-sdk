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
 * Creates a new translation for a specific group within the system.
 * This function allows for the addition of a translation to a group by specifying the group ID and locale.
 * It supports optional auto-translation and updates the query cache upon successful creation.
 * @name PostGroupTranslation
 * @param {string} groupId - The ID of the group
 * @param {string} locale - The locale for the translation
 * @param {boolean} [autoTranslate] - Whether to automatically translate the content
 * @version 1.2
 **/

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
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<GroupTranslation>>(
    `/groups/${groupId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
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
  >(CreateGroupTranslation, options, {
    domain: "groups",
    type: "update",
  });
};