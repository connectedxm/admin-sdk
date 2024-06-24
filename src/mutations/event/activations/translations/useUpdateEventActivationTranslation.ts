import { GetAdminAPI } from "@src/AdminAPI";
import { ActivationTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
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
  eventActivationTranslation: ActivationTranslation;
}

/**
 * @category Methods
 * @group Event-Activations-Translations
 */
export const UpdateEventActivationTranslation = async ({
  eventId,
  activationId,
  eventActivationTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventActivationTranslationParams): Promise<
  ConnectedXMResponse<ActivationTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = eventActivationTranslation;

  const { data } = await connectedXM.put<
    ConnectedXMResponse<ActivationTranslation>
  >(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`,
    body
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
    MutationOptions<
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
  >(UpdateEventActivationTranslation, options);
};
