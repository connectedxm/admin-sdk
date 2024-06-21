import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_TRANSLATION_QUERY_DATA } from "@context/queries/events/sessions/translations/useGetEventSessionTranslation";
import { EVENT_SESSION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/sessions/translations/useGetEventSessionTranslations";
import { SessionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventSessionTranslationProps {
  eventId: string;
  sessionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
  autoTranslate,
}: CreateEventSessionTranslationProps): Promise<
  ConnectedXMResponse<SessionTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions/${sessionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventSessionTranslation = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventSessionTranslationProps, "eventId" | "sessionId">
  >(
    (props) => CreateEventSessionTranslation({ eventId, sessionId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventSessionTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventSessionTranslation;
