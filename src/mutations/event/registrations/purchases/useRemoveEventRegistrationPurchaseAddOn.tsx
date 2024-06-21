import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Purchase } from "@interfaces";
import { SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";
import { EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchaseAddOns";

interface RemoveEventRegistrationPurchaseAddOnParams {
  addOnId: string;
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const RemoveEventRegistrationPurchaseAddOn = async ({
  addOnId,
  eventId,
  registrationId,
  purchaseId,
}: RemoveEventRegistrationPurchaseAddOnParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/addOns/${addOnId}`
  );
  return data;
};

export const useRemoveEventRegistrationPurchaseAddOn = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (addOnId: string) =>
      RemoveEventRegistrationPurchaseAddOn({
        addOnId,
        eventId,
        registrationId,
        purchaseId,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof RemoveEventRegistrationPurchaseAddOn>
        >
      ) => {
        SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA(
          queryClient,
          [eventId, registrationId, purchaseId],
          response
        );
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY(
            eventId,
            registrationId,
            purchaseId
          )
        );
      },
    }
  );
};

export default useRemoveEventRegistrationPurchaseAddOn;
