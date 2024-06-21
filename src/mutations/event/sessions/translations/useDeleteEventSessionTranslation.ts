import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_SESSION_TRANSLATION_QUERY_KEY } from "@context/queries/events/sessions/translations/useGetEventSessionTranslation";
import { EVENT_SESSION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/sessions/translations/useGetEventSessionTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventSessionTranslationProps {
  eventId: string;
  sessionId: string;
  locale: string;
}

export const DeleteEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
}: DeleteEventSessionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventSessionTranslation = (
  eventId: string,
  sessionId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventSessionTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId)
      );
      queryClient.invalidateQueries(
        EVENT_SESSION_TRANSLATION_QUERY_KEY(eventId, sessionId, locale)
      );
    },
  });
};

export default useDeleteEventSessionTranslation;
