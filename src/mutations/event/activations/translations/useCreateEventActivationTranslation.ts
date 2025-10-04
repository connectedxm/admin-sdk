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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
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
  >(CreateEventActivationTranslation, options);
};

export default useCreateEventActivationTranslation;
