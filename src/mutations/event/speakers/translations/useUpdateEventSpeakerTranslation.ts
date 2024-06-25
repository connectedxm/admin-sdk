import { GetAdminAPI } from "@src/AdminAPI";
import { EventSpeakerTranslation } from "@src/interfaces";
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
 * @category Params
 * @group Event-Speakers-Translations
 */
export interface UpdateEventSpeakerTranslationParams extends MutationParams {
  eventId: string;
  speakerId: string;
  speakerTranslation: EventSpeakerTranslation;
}

/**
 * @category Methods
 * @group Event-Speakers-Translations
 */
export const UpdateEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  speakerTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventSpeakerTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = speakerTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/activations/${speakerId}/translations/${locale}`,
    body
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

/**
 * @category Mutations
 * @group Event-Speakers-Translations
 */
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
  >(UpdateEventSpeakerTranslation, options);
};
