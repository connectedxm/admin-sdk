import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Purchase } from "@interfaces";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchases";
import { SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";

interface UpdateEventRegistrationPurchaseParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  purchase: Purchase;
}

export const UpdateEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  purchase,
}: UpdateEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`,
    purchase
  );
  return data;
};

export const useUpdateEventRegistrationPurchase = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Purchase>(
    (purchase: Purchase) =>
      UpdateEventRegistrationPurchase({
        eventId,
        registrationId,
        purchaseId,
        purchase,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventRegistrationPurchase>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId)
        );

        SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA(
          queryClient,
          [eventId, registrationId, purchaseId],
          response
        );
      },
    }
  );
};

export default useUpdateEventRegistrationPurchase;
