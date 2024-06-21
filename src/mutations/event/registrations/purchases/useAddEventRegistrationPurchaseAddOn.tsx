import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Purchase } from "@interfaces";
import { SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";
import { EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchaseAddOns";

interface AddEventRegistrationPurchaseAddOnParams {
  addOnId: string;
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const AddEventRegistrationPurchaseAddOn = async ({
  addOnId,
  eventId,
  registrationId,
  purchaseId,
}: AddEventRegistrationPurchaseAddOnParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/addOns/${addOnId}`
  );
  return data;
};

export const useAddEventRegistrationPurchaseAddOn = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (addOnId: string) =>
      AddEventRegistrationPurchaseAddOn({
        addOnId,
        eventId,
        registrationId,
        purchaseId,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventRegistrationPurchaseAddOn>>
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

export default useAddEventRegistrationPurchaseAddOn;
