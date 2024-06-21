import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Purchase } from "@interfaces";
import { useRouter } from "next/router";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchases";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";
import { EVENT_REGISTRATION_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistration";

interface CancelEventRegistrationPurchaseTransferParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  transferId: string;
}

export const CancelEventRegistrationPurchaseTransfer = async ({
  eventId,
  registrationId,
  purchaseId,
  transferId,
}: CancelEventRegistrationPurchaseTransferParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/transfers/${transferId}`
  );
  return data;
};

export const useCancelEventRegistrationPurchaseTransfer = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  transferId: string
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () =>
      CancelEventRegistrationPurchaseTransfer({
        eventId,
        registrationId,
        purchaseId,
        transferId,
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId)
        );
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId)
        );
        queryClient.removeQueries(
          EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
            eventId,
            registrationId,
            purchaseId
          )
        );
      },
    }
  );
};

export default useCancelEventRegistrationPurchaseTransfer;
