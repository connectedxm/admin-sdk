import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationQuestionResponse } from "@interfaces";
import { EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchaseResponses";
import { SET_EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_DATA } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchaseResponse";

interface UpdateEventRegistrationPurchaseResponseParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questionId: string;
  response: RegistrationQuestionResponse;
}

export const UpdateEventRegistrationPurchaseResponse = async ({
  eventId,
  registrationId,
  purchaseId,
  questionId,
  response,
}: UpdateEventRegistrationPurchaseResponseParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses/${questionId}`,
    response
  );
  return data;
};

export const useUpdateEventRegistrationPurchaseResponse = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationQuestionResponse>(
    (response: RegistrationQuestionResponse) =>
      UpdateEventRegistrationPurchaseResponse({
        eventId,
        registrationId,
        purchaseId,
        questionId,
        response,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateEventRegistrationPurchaseResponse>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(
            eventId,
            registrationId,
            purchaseId
          )
        );
        SET_EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_DATA(
          queryClient,
          [eventId, registrationId, purchaseId, questionId],
          response
        );
      },
    }
  );
};

export default useUpdateEventRegistrationPurchaseResponse;
