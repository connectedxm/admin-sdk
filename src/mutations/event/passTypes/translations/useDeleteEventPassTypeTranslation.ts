import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY,
  EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation for an event pass type.
 * This function allows the removal of a translation associated with a particular event pass type and locale.
 * It is useful in scenarios where outdated or incorrect translations need to be removed from the system.
 * @name DeleteEventPassTypeTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} passTypeId (path) - The ID of the pass type
 * @param {string} locale (path) - The locale of the translation to be deleted
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-PassTypes-Translations
 */
export interface DeleteEventPassTypeTranslationParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-PassTypes-Translations
 */
export const DeleteEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypeTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/passTypes/${passTypeId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY(
        eventId,
        passTypeId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes-Translations
 */
export const useDeleteEventPassTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassTypeTranslation>>,
      Omit<
        DeleteEventPassTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassTypeTranslationParams,
    Awaited<ReturnType<typeof DeleteEventPassTypeTranslation>>
  >(DeleteEventPassTypeTranslation, options, {
    domain: "events",
    type: "update",
  });
};