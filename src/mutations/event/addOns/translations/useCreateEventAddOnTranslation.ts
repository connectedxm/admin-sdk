import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA } from "@context/queries/events/addOns/translations/useGetEventAddOnTranslation";
import { EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/addOns/translations/useGetEventAddOnTranslations";
import { EventAddOnTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventAddOnTranslationProps {
  eventId: string;
  addOnId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
  autoTranslate,
}: CreateEventAddOnTranslationProps): Promise<
  ConnectedXMResponse<EventAddOnTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/addOns/${addOnId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventAddOnTranslation = (
  eventId: string,
  addOnId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventAddOnTranslationProps, "eventId" | "addOnId">
  >(
    (props) => CreateEventAddOnTranslation({ eventId, addOnId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventAddOnTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventAddOnTranslation;
