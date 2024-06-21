import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Purchase } from "@interfaces";
import { useRouter } from "next/router";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchases";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";

interface DeleteEventRegistrationPurchaseParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const DeleteEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
}: DeleteEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );
  return data;
};

export const useDeleteEventRegistrationPurchase = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () =>
      DeleteEventRegistrationPurchase({
        eventId,
        registrationId,
        purchaseId,
      }),
    {
      onSuccess: async () => {
        await router.push(
          `/events/${eventId}/registrations/${registrationId}/purchases`
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

export default useDeleteEventRegistrationPurchase;
