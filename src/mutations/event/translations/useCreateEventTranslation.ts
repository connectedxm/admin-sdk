import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_TRANSLATION_QUERY_DATA } from "@context/queries/events/translations/useGetEventTranslation";
import { EVENT_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/translations/useGetEventTranslations";
import { EventTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventTranslationProps {
  eventId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventTranslation = async ({
  eventId,
  locale,
  autoTranslate,
}: CreateEventTranslationProps): Promise<
  ConnectedXMResponse<EventTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(`/events/${eventId}/translations`, {
    locale,
    autoTranslate,
  });

  return data;
};

export const useCreateEventTranslation = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Omit<CreateEventTranslationProps, "eventId">>(
    (props) => CreateEventTranslation({ eventId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventTranslation>>
      ) => {
        queryClient.invalidateQueries(EVENT_TRANSLATIONS_QUERY_KEY(eventId));
        SET_EVENT_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, response.data.locale],
          response
        );
      },
    },
    "Hold on while we create a translation"
  );
};

export default useCreateEventTranslation;
