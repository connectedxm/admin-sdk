import { GetAdminAPI } from "@src/AdminAPI";
import { EventEmailType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_EMAIL_TRANSLATIONS_QUERY_KEY,
  EVENT_EMAIL_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific event email translation for a given event, email type, and locale.
 * This function is used to remove translations of event-related emails, ensuring that outdated or incorrect translations are no longer available.
 * It is particularly useful in scenarios where event details change and corresponding email translations need to be updated or removed.
 * @name DeleteEventEmailTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {EventEmailType} type (path) The type of the event email
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Emails-Translations
 */
export interface DeleteEventEmailTranslationParams extends MutationParams {
  eventId: string;
  type: EventEmailType;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Emails-Translations
 */
export const DeleteEventEmailTranslation = async ({
  eventId,
  type,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventEmailTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/emails/${type}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_EMAIL_TRANSLATIONS_QUERY_KEY(eventId, type),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_EMAIL_TRANSLATION_QUERY_KEY(eventId, type, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Emails-Translations
 */
export const useDeleteEventEmailTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventEmailTranslation>>,
      Omit<DeleteEventEmailTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventEmailTranslationParams,
    Awaited<ReturnType<typeof DeleteEventEmailTranslation>>
  >(DeleteEventEmailTranslation, options, {
    domain: "events",
    type: "update",
  });
};
