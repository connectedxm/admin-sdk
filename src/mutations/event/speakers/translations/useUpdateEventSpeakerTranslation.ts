import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA } from "@context/queries/events/speakers/translations/useGetEventSpeakerTranslation";
import { EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/speakers/translations/useGetEventSpeakerTranslations";
import { SpeakerTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventSpeakerTranslationProps {
  eventId: string;
  speakerId: string;
  speakerTranslation: SpeakerTranslation;
}

export const UpdateEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  speakerTranslation,
}: UpdateEventSpeakerTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = speakerTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/activations/${speakerId}/translations/${speakerTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventSpeakerTranslation = (
  eventId: string,
  speakerId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<SpeakerTranslation>(
    (speakerTranslation: SpeakerTranslation) =>
      UpdateEventSpeakerTranslation({
        eventId,
        speakerId,
        speakerTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventSpeakerTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId)
        );
        SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, speakerId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventSpeakerTranslation;
