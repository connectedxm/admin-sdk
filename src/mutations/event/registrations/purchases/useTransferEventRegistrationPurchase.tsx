import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchases";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";
import { EVENT_REGISTRATION_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistration";

interface TransferEventRegistrationPurchaseParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  accountId: string;
}

export const TransferEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  accountId,
}: TransferEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/transfers`,
    { accountId }
  );

  return data;
};

export const useTransferEventRegistrationPurchase = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (accountId: string) =>
      TransferEventRegistrationPurchase({
        eventId,
        registrationId,
        purchaseId,
        accountId,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof TransferEventRegistrationPurchase>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId)
        );
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId)
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

export default useTransferEventRegistrationPurchase;
