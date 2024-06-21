import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA } from "@context/queries/events/speakers/translations/useGetEventSpeakerTranslation";
import { EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/speakers/translations/useGetEventSpeakerTranslations";
import { SpeakerTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventSpeakerTranslationProps {
  eventId: string;
  speakerId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
  autoTranslate,
}: CreateEventSpeakerTranslationProps): Promise<
  ConnectedXMResponse<SpeakerTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/speakers/${speakerId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventSpeakerTranslation = (
  eventId: string,
  speakerId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventSpeakerTranslationProps, "eventId" | "speakerId">
  >(
    (props) => CreateEventSpeakerTranslation({ eventId, speakerId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventSpeakerTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventSpeakerTranslation;
