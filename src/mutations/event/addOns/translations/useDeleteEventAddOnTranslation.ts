import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_ADD_ON_TRANSLATION_QUERY_KEY } from "@context/queries/events/addOns/translations/useGetEventAddOnTranslation";
import { EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/addOns/translations/useGetEventAddOnTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventAddOnTranslationProps {
  eventId: string;
  addOnId: string;
  locale: string;
}

export const DeleteEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
}: DeleteEventAddOnTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/addOns/${addOnId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventAddOnTranslation = (
  eventId: string,
  addOnId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventAddOnTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId)
      );
      queryClient.invalidateQueries(
        EVENT_ADD_ON_TRANSLATION_QUERY_KEY(eventId, addOnId, locale)
      );
    },
  });
};

export default useDeleteEventAddOnTranslation;
