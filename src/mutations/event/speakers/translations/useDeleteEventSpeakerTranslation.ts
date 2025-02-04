import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY,
  EVENT_SPEAKER_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Speakers-Translations
 */
export interface DeleteEventSpeakerTranslationParams extends MutationParams {
  eventId: string;
  speakerId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Speakers-Translations
 */
export const DeleteEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSpeakerTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/speakers/${speakerId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKER_TRANSLATION_QUERY_KEY(eventId, speakerId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Speakers-Translations
 */
export const useDeleteEventSpeakerTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSpeakerTranslation>>,
      Omit<
        DeleteEventSpeakerTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSpeakerTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSpeakerTranslation>>
  >(DeleteEventSpeakerTranslation, options, {
    domain: "events",
    type: "update",
  });
};
