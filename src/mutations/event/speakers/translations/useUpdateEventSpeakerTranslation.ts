import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSpeakerTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation details for a specific event speaker.
 * This function allows for the modification of translation data associated with a speaker in a particular event.
 * It is designed to be used in applications where multilingual support for event speakers is required.
 * @name UpdateEventSpeakerTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} speakerId (path) - The ID of the speaker
 * @param {ISupportedLocale} locale (path) - The locale for the translation
 * @param {EventSpeakerTranslationUpdateInputs} speakerTranslation (body) - The translation inputs for the speaker
 * @version 1.3
 */

export interface UpdateEventSpeakerTranslationParams extends MutationParams {
  eventId: string;
  speakerId: string;
  locale: ISupportedLocale;
  speakerTranslation: EventSpeakerTranslationUpdateInputs;
}

export const UpdateEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
  speakerTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventSpeakerTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/activations/${speakerId}/translations/${locale}`,
    speakerTranslation
  );
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

export const useUpdateEventSpeakerTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSpeakerTranslation>>,
      Omit<
        UpdateEventSpeakerTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSpeakerTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSpeakerTranslation>>
  >(UpdateEventSpeakerTranslation, options, {
    domain: "events",
    type: "update",
  });
};