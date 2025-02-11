import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSpeakerTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event speaker.
 * This function allows the creation of a translation for a speaker at a given event, supporting multiple locales and optional auto-translation.
 * It is designed to be used in applications where multilingual support for event speakers is required.
 * @name PostEventSpeakerTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} speakerId (path) The ID of the speaker
 * @param {string} locale (bodyValue) The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) Whether to automatically translate the content
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Speakers-Translations
 */
export interface CreateEventSpeakerTranslationParams extends MutationParams {
  eventId: string;
  speakerId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Speakers-Translations
 */
export const CreateEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSpeakerTranslationParams): Promise<
  ConnectedXMResponse<EventSpeakerTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventSpeakerTranslation>
  >(`/events/${eventId}/speakers/${speakerId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId),
    });
    SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, speakerId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Speakers-Translations
 */
export const useCreateEventSpeakerTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSpeakerTranslation>>,
      Omit<
        CreateEventSpeakerTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSpeakerTranslationParams,
    Awaited<ReturnType<typeof CreateEventSpeakerTranslation>>
  >(CreateEventSpeakerTranslation, options, {
    domain: "events",
    type: "update",
  });
};
