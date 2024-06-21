import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_TRANSLATION_QUERY_KEY } from "@context/queries/events/translations/useGetEventTranslation";
import { EVENT_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/translations/useGetEventTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventTranslationProps {
  eventId: string;
  locale: string;
}

export const DeleteEventTranslation = async ({
  eventId,
  locale,
}: DeleteEventTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventTranslation = (eventId: string, locale: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(EVENT_TRANSLATIONS_QUERY_KEY(eventId));
      queryClient.invalidateQueries(
        EVENT_TRANSLATION_QUERY_KEY(eventId, locale)
      );
    },
  });
};

export default useDeleteEventTranslation;
