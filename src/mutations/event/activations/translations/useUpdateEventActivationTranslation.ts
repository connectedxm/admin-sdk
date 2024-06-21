import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA } from "@context/queries/events/activations/translations/useGetEventActivationTranslation";
import { EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/activations/translations/useGetEventActivationTranslations";
import { EventActivationTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventActivationTranslationProps {
  eventId: string;
  activationId: string;
  eventActivationTranslation: EventActivationTranslation;
}

export const UpdateEventActivationTranslation = async ({
  eventId,
  activationId,
  eventActivationTranslation,
}: UpdateEventActivationTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = eventActivationTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/activations/${activationId}/translations/${eventActivationTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventActivationTranslation = (
  eventId: string,
  activationId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<EventActivationTranslation>(
    (eventActivationTranslation: EventActivationTranslation) =>
      UpdateEventActivationTranslation({
        eventId,
        activationId,
        eventActivationTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventActivationTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId)
        );
        SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, activationId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventActivationTranslation;
