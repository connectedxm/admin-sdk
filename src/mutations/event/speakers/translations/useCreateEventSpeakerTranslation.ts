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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
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
