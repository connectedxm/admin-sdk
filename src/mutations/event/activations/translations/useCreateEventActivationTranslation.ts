import { ConnectedXMResponse } from "@src/interfaces";
import { MutationParams } from "@src/mutations/useConnectedMutation";

export interface CreateEventActivationTranslationProps extends MutationParams {
  eventId: string;
  activationId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventActivationTranslationProps): Promise<
  ConnectedXMResponse<EventActivationTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/activations/${activationId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventActivationTranslation = (
  eventId: string,
  activationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventActivationTranslationProps, "eventId" | "activationId">
  >(
    (props) =>
      CreateEventActivationTranslation({ eventId, activationId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventActivationTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventActivationTranslation;
