import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA } from "@context/queries/events/addOns/translations/useGetEventAddOnTranslation";
import { EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/addOns/translations/useGetEventAddOnTranslations";
import { EventAddOnTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventAddOnTranslationProps {
  eventId: string;
  addOnId: string;
  addOnTranslation: EventAddOnTranslation;
}

export const UpdateEventAddOnTranslation = async ({
  eventId,
  addOnId,
  addOnTranslation,
}: UpdateEventAddOnTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = addOnTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/addOns/${addOnId}/translations/${addOnTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventAddOnTranslation = (
  eventId: string,
  addOnId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<EventAddOnTranslation>(
    (addOnTranslation: EventAddOnTranslation) =>
      UpdateEventAddOnTranslation({
        eventId,
        addOnId,
        addOnTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventAddOnTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId)
        );
        SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, addOnId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventAddOnTranslation;
