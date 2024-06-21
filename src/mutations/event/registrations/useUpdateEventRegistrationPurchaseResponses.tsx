import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchaseResponses";
import { EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchaseSections";

interface Question {
  id: number;
  value: string;
}

interface UpdateEventRegistrationPurchaseResponsesParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questions: Question[];
}

export const UpdateEventRegistrationPurchaseResponses = async ({
  eventId,
  registrationId,
  purchaseId,
  questions,
}: UpdateEventRegistrationPurchaseResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses`,
    { questions }
  );
  return data;
};

export const useUpdateEventRegistrationPurchaseResponses = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (questions: Question[]) =>
      UpdateEventRegistrationPurchaseResponses({
        eventId,
        registrationId,
        purchaseId,
        questions,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(
            eventId,
            registrationId,
            purchaseId
          )
        );
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
            eventId,
            registrationId,
            purchaseId
          )
        );
      },
    }
  );
};

export default useUpdateEventRegistrationPurchaseResponses;
