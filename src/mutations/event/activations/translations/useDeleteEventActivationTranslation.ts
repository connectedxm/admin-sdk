import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY,
  EVENT_ACTIVATION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific event activation translation for a given event, activation, and locale.
 * This function is used to remove translations associated with event activations, ensuring that the specified translation is no longer available.
 * It is particularly useful in scenarios where outdated or incorrect translations need to be removed from the system.
 * @name DeleteEventActivationTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} activationId - The ID of the activation
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Activations-Translations
 */
export interface DeleteEventActivationTranslationParams extends MutationParams {
  eventId: string;
  activationId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Activations-Translations
 */
export const DeleteEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventActivationTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_TRANSLATION_QUERY_KEY(
        eventId,
        activationId,
        locale
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Activations-Translations
 */
export const useDeleteEventActivationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventActivationTranslation>>,
      Omit<
        DeleteEventActivationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventActivationTranslationParams,
    Awaited<ReturnType<typeof DeleteEventActivationTranslation>>
  >(DeleteEventActivationTranslation, options, {
    domain: "events",
    type: "update",
  });
};