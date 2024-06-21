import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_ACTIVATION_TRANSLATION_QUERY_KEY } from "@context/queries/events/activations/translations/useGetEventActivationTranslation";
import { EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/activations/translations/useGetEventActivationTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventActivationTranslationProps {
  eventId: string;
  activationId: string;
  locale: string;
}

export const DeleteEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
}: DeleteEventActivationTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventActivationTranslation = (
  eventId: string,
  activationId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventActivationTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId)
      );
      queryClient.invalidateQueries(
        EVENT_ACTIVATION_TRANSLATION_QUERY_KEY(eventId, activationId, locale)
      );
    },
  });
};

export default useDeleteEventActivationTranslation;
