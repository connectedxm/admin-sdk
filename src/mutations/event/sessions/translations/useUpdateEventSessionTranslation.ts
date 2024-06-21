import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_TRANSLATION_QUERY_DATA } from "@context/queries/events/sessions/translations/useGetEventSessionTranslation";
import { EVENT_SESSION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/sessions/translations/useGetEventSessionTranslations";
import { SessionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventSessionTranslationProps {
  eventId: string;
  sessionId: string;
  sessionTranslation: SessionTranslation;
}

export const UpdateEventSessionTranslation = async ({
  eventId,
  sessionId,
  sessionTranslation,
}: UpdateEventSessionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = sessionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/translations/${sessionTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventSessionTranslation = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<SessionTranslation>(
    (sessionTranslation: SessionTranslation) =>
      UpdateEventSessionTranslation({
        eventId,
        sessionId,
        sessionTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventSessionTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId)
        );
        SET_EVENT_SESSION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, sessionId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventSessionTranslation;
