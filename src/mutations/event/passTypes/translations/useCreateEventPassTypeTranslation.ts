import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassTypeTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event pass type.
 * This function allows the creation of translations for event pass types, enabling support for multiple locales.
 * It is designed to be used in applications where event pass types need to be translated into different languages.
 * @name CreateEventPassTypeTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} passTypeId - The ID of the pass type
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the pass type
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-PassTypes-Translations
 */
export interface CreateEventPassTypeTranslationParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-PassTypes-Translations
 */
export const CreateEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventPassTypeTranslationParams): Promise<
  ConnectedXMResponse<EventPassTypeTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventPassTypeTranslation>
  >(`/events/${eventId}/passTypes/${passTypeId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, passTypeId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes-Translations
 */
export const useCreateEventPassTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPassTypeTranslation>>,
      Omit<
        CreateEventPassTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassTypeTranslationParams,
    Awaited<ReturnType<typeof CreateEventPassTypeTranslation>>
  >(CreateEventPassTypeTranslation, options, {
    domain: "events",
    type: "update",
  });
};