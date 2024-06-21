import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_SPEAKER_TRANSLATION_QUERY_KEY } from "@context/queries/events/speakers/translations/useGetEventSpeakerTranslation";
import { EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/speakers/translations/useGetEventSpeakerTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventSpeakerTranslationProps {
  eventId: string;
  speakerId: string;
  locale: string;
}

export const DeleteEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
}: DeleteEventSpeakerTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/speakers/${speakerId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventSpeakerTranslation = (
  eventId: string,
  speakerId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventSpeakerTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId)
      );
      queryClient.invalidateQueries(
        EVENT_SPEAKER_TRANSLATION_QUERY_KEY(eventId, speakerId, locale)
      );
    },
  });
};

export default useDeleteEventSpeakerTranslation;
