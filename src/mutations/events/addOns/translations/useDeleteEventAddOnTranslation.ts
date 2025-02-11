import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY,
  EVENT_ADD_ON_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation for an event add-on based on the provided event ID, add-on ID, and locale.
 * This function is used to remove translations associated with event add-ons, ensuring that outdated or incorrect translations can be managed effectively.
 * It also handles cache invalidation for the related queries to ensure data consistency.
 * @name DeleteEventAddOnTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} addOnId (path) The ID of the add-on
 * @param {string} locale (path) The locale of the translation to be deleted
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-AddOns-Translations
 */
export interface DeleteEventAddOnTranslationParams extends MutationParams {
  eventId: string;
  addOnId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-AddOns-Translations
 */
export const DeleteEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventAddOnTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/addOns/${addOnId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TRANSLATION_QUERY_KEY(eventId, addOnId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns-Translations
 */
export const useDeleteEventAddOnTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAddOnTranslation>>,
      Omit<DeleteEventAddOnTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAddOnTranslationParams,
    Awaited<ReturnType<typeof DeleteEventAddOnTranslation>>
  >(DeleteEventAddOnTranslation, options, {
    domain: "events",
    type: "update",
  });
};
