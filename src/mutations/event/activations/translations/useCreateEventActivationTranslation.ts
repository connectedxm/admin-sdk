import { GetAdminAPI } from "@src/AdminAPI";
import { ActivationTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for an event activation in a specified locale.
 * This function allows users to add translations to event activations, with an option for automatic translation.
 * It is designed to be used in applications that manage multilingual event content.
 * @name PostEventActivationTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} activationId (path) The ID of the activation
 * @param {string} locale (bodyValue) The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) Whether to automatically translate the content
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Activations-Translations
 */
export interface CreateEventActivationTranslationParams extends MutationParams {
  eventId: string;
  activationId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Activations-Translations
 */
export const CreateEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: //EventActivationTranslation was renamed to ActivationTranslation?
CreateEventActivationTranslationParams): Promise<
  ConnectedXMResponse<ActivationTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<ActivationTranslation>
  >(`/events/${eventId}/activations/${activationId}/translations`, {
    locale,
    autoTranslate,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId),
    });
    SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, activationId, data?.data.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Activations-Translations
 */
export const useCreateEventActivationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventActivationTranslation>>,
      Omit<
        CreateEventActivationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventActivationTranslationParams,
    Awaited<ReturnType<typeof CreateEventActivationTranslation>>
  >(CreateEventActivationTranslation, options, {
    domain: "events",
    type: "update",
  });
};

export default useCreateEventActivationTranslation;
