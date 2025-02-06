import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTranslation } from "@src/interfaces";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event in a given locale.
 * This function allows users to add translations to events, with an option for automatic translation.
 * It is designed to be used in applications where multilingual support for events is required.
 * @name PostEventTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} locale (bodyValue) The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) Whether to automatically translate the event
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Translations
 */
export interface CreateEventTranslationParams extends MutationParams {
  eventId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Translations
 */
export const CreateEventTranslation = async ({
  eventId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventTranslationParams): Promise<
  ConnectedXMResponse<EventTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<EventTranslation>>(
    `/events/${eventId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Translations
 */
export const useCreateEventTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventTranslation>>,
      Omit<CreateEventTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventTranslationParams,
    Awaited<ReturnType<typeof CreateEventTranslation>>
  >(CreateEventTranslation, options, {
    domain: "events",
    type: "update",
  });
};

export default useCreateEventTranslation;
