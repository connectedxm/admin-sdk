import { GetAdminAPI } from "@src/AdminAPI";
import {
  ActivationTranslation,
  ConnectedXMResponse,
  ISupportedLocale,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationTranslationUpdateInputs } from "@src/params";
import {
  EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation for a specific event activation.
 * This function allows updating the translation details for a given event activation identified by eventId and activationId.
 * It is designed to be used in applications where event activation translations need to be modified.
 * @name UpdateEventActivationTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} activationId (path) - The ID of the activation
 * @param {ISupportedLocale} locale (path) - The locale for the translation
 * @param {EventActivationTranslationUpdateInputs} eventActivationTranslation (body) - The translation details to update
 * @version 1.3
 **/

export interface UpdateEventActivationTranslationParams extends MutationParams {
  eventId: string;
  activationId: string;
  locale: ISupportedLocale;
  eventActivationTranslation: EventActivationTranslationUpdateInputs;
}

export const UpdateEventActivationTranslation = async ({
  eventId,
  activationId,
  eventActivationTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventActivationTranslationParams): Promise<
  ConnectedXMResponse<ActivationTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<ActivationTranslation>
  >(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`,
    eventActivationTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId),
    });
    SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, activationId, data.data?.locale],
      data
    );
  }
  return data;
};

export const useUpdateEventActivationTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventActivationTranslation>>,
      Omit<
        UpdateEventActivationTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventActivationTranslationParams,
    Awaited<ReturnType<typeof UpdateEventActivationTranslation>>
  >(UpdateEventActivationTranslation, options, {
    domain: "events",
    type: "update",
  });
};