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
 * @category Params
 * @group Event-Activations-Translations
 */
export interface UpdateEventActivationTranslationParams extends MutationParams {
  eventId: string;
  activationId: string;
  locale: ISupportedLocale;
  eventActivationTranslation: EventActivationTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Activations-Translations
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
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

/**
 * @category Mutations
 * @group Event-Activations-Translations
 */
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
