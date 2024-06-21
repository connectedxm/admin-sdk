import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Purchase } from "@interfaces";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchases";
import { SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA } from "@context/queries/events/registrations/purchases/useGetEventRegistrationPurchase";

interface CreateEventRegistrationPurchaseParams {
  eventId: string;
  registrationId: string;
  purchase: Purchase;
}

export const CreateEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchase,
}: CreateEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/${registrationId}/purchases`,
    purchase
  );
  return data;
};

export const useCreateEventRegistrationPurchase = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Purchase>(
    (purchase: Purchase) =>
      CreateEventRegistrationPurchase({
        eventId,
        registrationId,
        purchase,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventRegistrationPurchase>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId)
        );

        SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA(
          queryClient,
          [eventId, registrationId, response?.data?.id],
          response
        );
      },
    }
  );
};

export default useCreateEventRegistrationPurchase;
