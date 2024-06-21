import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_TRANSLATION_QUERY_DATA } from "@context/queries/events/translations/useGetEventTranslation";
import { EVENT_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/translations/useGetEventTranslations";
import { EventTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventTranslationProps {
  eventId: string;
  eventTranslation: EventTranslation;
}

export const UpdateEventTranslation = async ({
  eventId,
  eventTranslation,
}: UpdateEventTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = eventTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/translations/${eventTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventTranslation = (eventId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<EventTranslation>(
    (eventTranslation: EventTranslation) =>
      UpdateEventTranslation({ eventId, eventTranslation }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventTranslation>>
      ) => {
        queryClient.invalidateQueries(EVENT_TRANSLATIONS_QUERY_KEY(eventId));
        SET_EVENT_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventTranslation;
